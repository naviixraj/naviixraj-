import { useRef, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CARS } from '../data/cars'

export function CarModel({ modelPath, isActive, position, scale, opacity }) {
  const groupRef = useRef()
  const { scene } = useGLTF(modelPath)
  const { viewport } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })

  // Clone scene to allow multiple instances. Memoized to prevent recreating it on every render tick.
  const clonedScene = useMemo(() => scene.clone(), [scene])

  useEffect(() => {
    if (!isActive) return
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isActive])

  useEffect(() => {
    // Apply opacity/emissive to all meshes
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Save the original material so we don't clone a disposed clone
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }

        // Always clone from the clean, original material
        child.material = child.userData.originalMaterial.clone()
        child.material.transparent = true
        child.material.opacity = opacity
        
        // Cleanup cloned material on unmount or re-run to prevent memory leaks
        child.userData.clonedMaterial = child.material;
      }
    })
    
    return () => {
      clonedScene.traverse((child) => {
        if (child.isMesh && child.userData.clonedMaterial) {
          child.userData.clonedMaterial.dispose();
        }
      });
    }
  }, [opacity, clonedScene])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Continuously rotate clockwise
    groupRef.current.rotation.y -= delta * 0.5

    if (isActive) {
      // Still apply slight mouse tilt on X axis (up/down) for interactive feel
      targetRotation.current.x += (mouse.current.y * 0.1 - targetRotation.current.x) * 0.05
      groupRef.current.rotation.x = targetRotation.current.x
    } else {
      // Smoothly return X tilt to 0 when inactive
      targetRotation.current.x += (0 - targetRotation.current.x) * 0.05
      groupRef.current.rotation.x = targetRotation.current.x
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Preload all models to prevent stuttering
CARS.forEach((car) => {
  useGLTF.preload(car.modelPath)
})
