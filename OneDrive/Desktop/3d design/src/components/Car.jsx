import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function Car({ path, isActive, scale = 1, yOffset = 0 }) {
  const groupRef = useRef()
  const { scene } = useGLTF(path)
  const { mouse } = useThree()

  // Subtle tilt micro-interaction if this car is active (hero position)
  useFrame((state, delta) => {
    if (!groupRef.current) return

    if (isActive) {
      // Tilt towards mouse
      const targetX = (mouse.y * Math.PI) / 16
      const targetY = (mouse.x * Math.PI) / 16
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 4, delta)
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY + Math.PI / 4, 4, delta) // slight default angle
    } else {
      // Reset rotation
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, 0, 4, delta)
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, 0, 4, delta)
    }
  })

  // Normalize materials slightly for the environment reflections
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          // Increase metalness slightly to reflect the background
          child.material.envMapIntensity = 1.5
        }
      }
    })
  }, [scene])

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={scale} position={[0, yOffset, 0]} />
    </group>
  )
}

// Preload the models so they don't pop in
useGLTF.preload('/models/1969_ford_mustang_mach-1_428_cobra_jet/scene.gltf')
useGLTF.preload('/models/1971_corvette_c3_stingray_t-top_350/scene.gltf')
useGLTF.preload('/models/1973_chevrolet_corvette_convertible_454/scene.gltf')
useGLTF.preload('/models/1982_porsche_930_911_turbo_3.3/scene.gltf')
useGLTF.preload('/models/1992_porsche_911_964_turbo_s_3.6/scene.gltf')
useGLTF.preload('/models/2018_vertex_ridge_s14_silvia_kouki/scene.gltf')
useGLTF.preload('/models/2019_porsche_718_boxster_t/scene.gltf')
useGLTF.preload('/models/2023_ares_panther_progettouno/scene.gltf')
useGLTF.preload('/models/2023_lbsuper_silhouette_s15_silvia/scene.gltf')
useGLTF.preload('/models/ford_mustang_v__s197_ps1_styled/scene.gltf')
