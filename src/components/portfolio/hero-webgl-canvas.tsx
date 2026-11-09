"use client"

import type { ReactNode, RefObject } from "react"
import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ContactShadows, Float, PerspectiveCamera, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { PHONE_GLB } from "@/lib/portfolio-3d-preload"
import {
  getCachedScreenshot,
  isPortfolioScreenshot,
  preloadScreenshot,
} from "@/lib/screenshot-cache"

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

  useEffect(() => {
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

    return () => {
      materialRef.current = null
      mat.map = null
      mat.dispose()
    }
  }, [scene])

  useEffect(() => {
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
  }, [imageSrc, gl, scene])

  useEffect(() => {
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
  }, [gl, imageSrc, scene])

  return <primitive object={scene} />
}

const BASE_Y = 0.38
const MAX_TILT_X = 0.32

function PhoneRig({
  children,
  reducedMotion,
}: {
  children: ReactNode
  reducedMotion: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const pointer = useThree((s) => s.pointer)

  useFrame((state, delta) => {
    if (!group.current) return
    if (reducedMotion) {
      group.current.rotation.set(0, BASE_Y, 0)
      return
    }
    const t = state.clock.elapsedTime
    const idleY = Math.sin(t * 0.45) * 0.1
    const idleX = Math.sin(t * 0.3) * 0.04
    const targetY = BASE_Y + idleY + pointer.x * 0.42
    const targetX = idleX - pointer.y * 0.2
    const k = 1 - Math.pow(0.001, delta)
    group.current.rotation.y += (targetY - group.current.rotation.y) * k
    group.current.rotation.x += (targetX - group.current.rotation.x) * k
    group.current.rotation.x = THREE.MathUtils.clamp(
      group.current.rotation.x,
      -MAX_TILT_X,
      MAX_TILT_X
    )
  })

  return <group ref={group}>{children}</group>
}

function PhoneScene({
  imageSrc,
  reducedMotion,
}: {
  imageSrc: string
  reducedMotion: boolean
}) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={1.15} />
      <directionalLight position={[-6, 3, -4]} intensity={0.5} color="#f7e8d8" />
      <PhoneRig reducedMotion={reducedMotion}>
        <group position={[0, 0.05, 0]}>
          <Float
            speed={1.4}
            rotationIntensity={0.08}
            floatIntensity={0.35}
            enabled={!reducedMotion}
          >
            <PhoneModel imageSrc={imageSrc} />
          </Float>
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.55}
            scale={6.5}
            blur={2.4}
            far={3.2}
            resolution={128}
            color="#000000"
          />
        </group>
      </PhoneRig>
    </>
  )
}

export type HeroWebGLCanvasProps = {
  imageSrc: string
  eventSource?: RefObject<HTMLElement | null>
  reducedMotion?: boolean
}

/** WebGL phone preview inside `.hero-3d-frame` (no full-hero canvas / View tracking). */
export default function HeroWebGLCanvas({
  imageSrc,
  eventSource,
  reducedMotion = false,
}: HeroWebGLCanvasProps) {
  const dprMax = useMemo(
    () =>
      Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2),
    []
  )

  return (
    <Canvas
      className="hero-3d-canvas"
      eventSource={eventSource as RefObject<HTMLElement> | undefined}
      dpr={[1, dprMax]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
      frameloop={reducedMotion ? "demand" : "always"}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor(0x000000, 0)
        if (reducedMotion) invalidate()
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
      <PerspectiveCamera makeDefault fov={30} position={[0, 0.1, 5.75]} near={0.1} far={60} />
      <PhoneScene imageSrc={imageSrc} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

useGLTF.preload(PHONE_GLB)
