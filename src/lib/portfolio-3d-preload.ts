"use client"

import { useGLTF } from "@react-three/drei"

export const PHONE_GLB = "/portfolio/models/phone.glb"

let gltfPreloadStarted = false

/** Start fetching/parsing the phone GLB before the hero dynamic import runs. */
export function preloadPhoneGltf(): void {
  if (gltfPreloadStarted) return
  gltfPreloadStarted = true
  useGLTF.preload(PHONE_GLB)
}
