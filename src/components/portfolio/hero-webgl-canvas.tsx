"use client"

import type { ReactNode, RefObject } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber"
import { ContactShadows, Float, PerspectiveCamera, useGLTF, View } from "@react-three/drei"
import * as THREE from "three"
import { PHONE_GLB } from "@/lib/portfolio-3d-preload"
import {
  getCachedScreenshot,
  isPortfolioScreenshot,
  preloadScreenshot,
} from "@/lib/screenshot-cache"
import { HeroSceneTech } from "./hero-scene-tech"

const SCREEN_NAME_RE = /screen|display|lcd/i

function hasScreenName(obj: THREE.Object3D | null): boolean {
  let o = obj
  while (o) {
    if (SCREEN_NAME_RE.test(o.name)) return true
    o = o.parent
  }
  return false
}

function findScreenMesh(root: THREE.Object3D): THREE.Mesh | null {
  root.updateMatrixWorld(true)
  let byName: THREE.Mesh | null = null
  let largest: THREE.Mesh | null = null
  let largestArea = -Infinity

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!(mesh as THREE.Mesh).isMesh) return
    if (hasScreenName(mesh)) {
      byName = mesh
      return
    }
    const box = new THREE.Box3().setFromObject(mesh)
    const size = box.getSize(new THREE.Vector3())
    const area = size.x * size.y
    if (area > largestArea) {
      largestArea = area
      largest = mesh
    }
  })

  return byName ?? largest
}

type UVOpts = { flipU?: boolean; flipV?: boolean }

function rebuildScreenUV(geometry: THREE.BufferGeometry, opts: UVOpts = {}) {
  const pos = geometry.attributes.position as THREE.BufferAttribute
  geometry.computeBoundingBox()
  const bb = geometry.boundingBox!
  const size = bb.getSize(new THREE.Vector3())
  const axes = [0, 1, 2].sort(
    (a, b) => size.getComponent(b) - size.getComponent(a)
  )
  const vAxis = axes[0]
  const uAxis = axes[1]
  const uSize = Math.max(size.getComponent(uAxis), 1e-6)
  const vSize = Math.max(size.getComponent(vAxis), 1e-6)
  const uMin = bb.min.getComponent(uAxis)
  const vMin = bb.min.getComponent(vAxis)
  const count = pos.count
  const uv = new Float32Array(count * 2)
  for (let i = 0; i < count; i++) {
    let u = (pos.getComponent(i, uAxis) - uMin) / uSize
    let v = (pos.getComponent(i, vAxis) - vMin) / vSize
    if (!opts.flipV) v = 1 - v
    if (opts.flipU) u = 1 - u
    uv[i * 2] = u
    uv[i * 2 + 1] = v
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2))
  if (geometry.attributes.uv1) geometry.deleteAttribute("uv1")
  if (geometry.attributes.uv2) geometry.deleteAttribute("uv2")
  if (geometry.attributes.uv3) geometry.deleteAttribute("uv3")
  geometry.attributes.uv.needsUpdate = true
}

const CANVAS_WIDTH = 1170

function imageToTexture(
  img: HTMLImageElement,
  screenAspect: number,
  anisotropy: number
): THREE.CanvasTexture {
  const w = CANVAS_WIDTH
  const h = Math.max(2, Math.round(CANVAS_WIDTH * screenAspect))
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, w, h)
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
  const tex = new THREE.CanvasTexture(canvas)
  tex.flipY = false
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = Math.min(anisotropy, 4)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true
  return tex
}

const screenTextureBySrc = new Map<string, THREE.CanvasTexture>()

function clearScreenTextureCache(): void {
  for (const tex of screenTextureBySrc.values()) {
    try {
      tex.dispose()
    } catch {
      /* context lost */
    }
  }
  screenTextureBySrc.clear()
}

function getOrCreateScreenTexture(
  imageSrc: string,
  img: HTMLImageElement,
  screenAspect: number,
  anisotropy: number
): THREE.CanvasTexture {
  const hit = screenTextureBySrc.get(imageSrc)
  if (hit) return hit
  const tex = imageToTexture(img, screenAspect, anisotropy)
  screenTextureBySrc.set(imageSrc, tex)
  return tex
}

function applyScreenTexture(
  mat: THREE.MeshBasicMaterial,
  imageSrc: string,
  img: HTMLImageElement,
  screenAspect: number,
  anisotropy: number
): void {
  mat.map = getOrCreateScreenTexture(imageSrc, img, screenAspect, anisotropy)
  mat.color.set(0xffffff)
  mat.needsUpdate = true
}

const PHONE_HEIGHT = 2.55

function PhoneModel({ imageSrc }: { imageSrc: string }) {
  const { scene: gltfSource } = useGLTF(PHONE_GLB)
  const scene = useMemo(() => gltfSource.clone(true), [gltfSource])
  const gl = useThree((s) => s.gl)
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const aspectRef = useRef(2532 / 1170)
  const setupDoneRef = useRef(false)
  const [modelReady, setModelReady] = useState(false)

  useEffect(() => {
    if (setupDoneRef.current) return
    setupDoneRef.current = true
    const mesh = findScreenMesh(scene)
    if (!mesh) {
      console.warn("[phone] no screen mesh found in GLB")
      return
    }
    rebuildScreenUV(mesh.geometry)
    const bb = mesh.geometry.boundingBox!
    const size = bb.getSize(new THREE.Vector3())
    const axes = [0, 1, 2].sort(
      (a, b) => size.getComponent(b) - size.getComponent(a)
    )
    aspectRef.current = Math.max(
      1.2,
      size.getComponent(axes[0]) / Math.max(size.getComponent(axes[1]), 1e-6)
    )
    const mat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0c,
      toneMapped: false,
    })
    mesh.material = mat
    materialRef.current = mat
    scene.scale.setScalar(1)
    scene.position.set(0, 0, 0)
    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const total = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s = PHONE_HEIGHT / Math.max(total.y, 1e-6)
    scene.scale.setScalar(s)
    scene.position.set(-center.x * s, -center.y * s, -center.z * s)
    setModelReady(true)
  }, [scene])

  useEffect(() => {
    if (!modelReady) return
    const mat = materialRef.current
    if (!mat || !imageSrc) return
    if (!isPortfolioScreenshot(imageSrc)) return

    let cancelled = false
    const aniso = gl.capabilities.getMaxAnisotropy()
    const paint = (img: HTMLImageElement) => {
      if (cancelled) return
      applyScreenTexture(mat, imageSrc, img, aspectRef.current, aniso)
    }

    const cached = getCachedScreenshot(imageSrc)
    if (cached) {
      paint(cached)
      return () => {
        cancelled = true
      }
    }

    void preloadScreenshot(imageSrc).then((img) => {
      if (img) paint(img)
    })
    return () => {
      cancelled = true
    }
  }, [imageSrc, gl, modelReady])

  useEffect(() => {
    if (!modelReady) return
    const el = gl.domElement
    const onRestored = () => {
      clearScreenTextureCache()
      const mat = materialRef.current
      if (!mat || !imageSrc || !isPortfolioScreenshot(imageSrc)) return
      const img = getCachedScreenshot(imageSrc)
      if (!img) return
      applyScreenTexture(
        mat,
        imageSrc,
        img,
        aspectRef.current,
        gl.capabilities.getMaxAnisotropy()
      )
    }
    el.addEventListener("webglcontextrestored", onRestored, false)
    return () => el.removeEventListener("webglcontextrestored", onRestored)
  }, [gl, imageSrc, modelReady])

  useEffect(() => {
    return () => {
      const mat = materialRef.current
      if (mat) {
        mat.map = null
        mat.dispose()
      }
    }
  }, [])

  return <primitive object={scene} />
}

function PhoneRig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const pointer = useThree((s) => s.pointer)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const idleY = Math.sin(t * 0.45) * 0.16
    const idleX = Math.sin(t * 0.3) * 0.045
    const targetY = idleY + pointer.x * 0.5
    const targetX = idleX - pointer.y * 0.22
    const k = 1 - Math.pow(0.001, delta)
    group.current.rotation.y += (targetY - group.current.rotation.y) * k
    group.current.rotation.x += (targetX - group.current.rotation.x) * k
  })

  return <group ref={group}>{children}</group>
}

function PhoneScene({ imageSrc }: { imageSrc: string }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={1.15} />
      <directionalLight position={[-6, 3, -4]} intensity={0.5} color="#f7e8d8" />
      <pointLight
        position={[0, 1.5, 4.5]}
        intensity={12}
        distance={12}
        decay={2}
        color="#ffffff"
      />
      <spotLight
        position={[0, 6, 2]}
        angle={0.5}
        penumbra={1}
        intensity={40}
        color="#ffe9d6"
      />
      <PhoneRig>
        <group position={[0, 0.05, 0]} rotation={[0, 0.38, 0]}>
          <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.4}>
            <PhoneModel imageSrc={imageSrc} />
          </Float>
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.62}
            scale={6.5}
            blur={2.6}
            far={3.2}
            resolution={256}
            color="#000000"
          />
        </group>
      </PhoneRig>
    </>
  )
}

export type HeroWebGLCanvasProps = {
  imageSrc: string
  eventSource: RefObject<HTMLElement | null>
  phoneTrackRef: RefObject<HTMLElement | null>
  reducedMotion?: boolean
}

/**
 * drei `<View>` disables R3F's default full-canvas render (priority > 0).
 * Draw the main scene (tech backdrop) before the phone view scissor pass.
 */
function HeroBackdropPass() {
  useFrame((state: RootState) => {
    const { gl, scene, camera, size } = state
    const prevAutoClear = gl.autoClear
    gl.autoClear = true
    gl.setScissorTest(false)
    gl.setViewport(0, 0, size.width, size.height)
    gl.render(scene, camera)
    gl.autoClear = prevAutoClear
  }, 1)
  return null
}

/** Single WebGL context: full-hero tech backdrop + phone tracked to `.hero-3d-frame`. */
export default function HeroWebGLCanvas({
  imageSrc,
  eventSource,
  phoneTrackRef,
  reducedMotion = false,
}: HeroWebGLCanvasProps) {
  const dprMax = useMemo(
    () =>
      Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2),
    []
  )

  return (
    <Canvas
      className="hero-webgl-canvas"
      eventSource={eventSource as RefObject<HTMLElement>}
      dpr={[1, dprMax]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        touchAction: "pan-y",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        const el = gl.domElement
        el.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault()
            clearScreenTextureCache()
          },
          false
        )
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5.25]} fov={44} near={0.1} far={48} />
      <ambientLight intensity={0.48} />
      <directionalLight position={[4, 5, 3]} intensity={0.85} color="#CDCBCA" />
      <directionalLight position={[-4, -2, -3]} intensity={0.72} color="#D41514" />
      <pointLight position={[0, 0, 2]} intensity={0.68} color="#D41514" />

      <HeroSceneTech reduced={reducedMotion} />
      <HeroBackdropPass />

      <View
        track={phoneTrackRef as RefObject<HTMLElement>}
        frames={Infinity}
        index={2}
      >
        <PerspectiveCamera makeDefault fov={30} position={[0, 0.1, 5.75]} near={0.1} far={60} />
        <PhoneScene imageSrc={imageSrc} />
      </View>
    </Canvas>
  )
}

useGLTF.preload(PHONE_GLB)
