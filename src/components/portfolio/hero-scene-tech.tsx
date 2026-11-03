"use client"

import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useDeviceMode } from "@/hooks/use-device-mode"
import { useIsLowEndDevice } from "@/hooks/use-is-low-end-device"

function TechCore({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const knot = useRef<THREE.Mesh>(null)
  const core = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (reduced) return
    const dt = Math.min(delta, 0.05)
    if (group.current) group.current.rotation.y += dt * 0.14
    if (group.current) group.current.rotation.z += dt * 0.04
    if (knot.current) knot.current.rotation.x += dt * 0.12
    if (core.current) {
      core.current.rotation.y -= dt * 0.35
      core.current.rotation.x += dt * 0.18
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.07
      core.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={group}>
      <mesh ref={knot}>
        <torusKnotGeometry args={[1.05, 0.26, 200, 24, 2, 3]} />
        <meshStandardMaterial
          color="#CDCBCA"
          wireframe
          transparent
          opacity={0.22}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color="#D41514"
          emissive="#D41514"
          emissiveIntensity={1.8}
          roughness={0.35}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        const r = 1.85
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, Math.sin(a) * r, Math.sin(a * 1.4) * 0.7]}
            rotation={[a, a * 0.6, 0]}
          >
            <boxGeometry args={[0.09, 0.09, 0.09]} />
            <meshStandardMaterial color="#CDCBCA" metalness={0.9} roughness={0.25} />
          </mesh>
        )
      })}
    </group>
  )
}

function Particles({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [count])

  const ref = useRef<THREE.Points>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#D41514"
        size={0.028}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** Full-hero decorative tech — sits in the main viewport behind HTML content. */
export function HeroSceneTech({ reduced }: { reduced: boolean }) {
  const { mode, orientation } = useDeviceMode()
  const lowEnd = useIsLowEndDevice()

  const layout = useMemo(() => {
    if (mode === "ipad" && orientation === "landscape") {
      return { position: [-1.05, 0.02, 0] as [number, number, number], scale: 1.2 }
    }
    if (mode === "phone" && orientation === "landscape") {
      return { position: [-0.55, 0, 0] as [number, number, number], scale: 0.95 }
    }
    return { position: [-0.25, 0.08, 0] as [number, number, number], scale: 1.05 }
  }, [mode, orientation])

  return (
    <group position={layout.position} scale={layout.scale}>
      <TechCore reduced={reduced} />
      {!lowEnd && !reduced && <Particles count={140} />}
    </group>
  )
}
