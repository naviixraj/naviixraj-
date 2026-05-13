import { useRef, useEffect } from 'react'
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

  // Clone scene to allow multiple instances
  const clonedScene = scene.clone()

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
        if (child.material) {
          child.material = child.material.clone()
          child.material.transparent = true
          child.material.opacity = opacity
          
          // Cleanup cloned material on unmount to prevent memory leaks
          child.userData.clonedMaterial = child.material;
        }
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

    if (isActive) {
      targetRotation.current.y += (mouse.current.x * 0.3 - targetRotation.current.y) * 0.05
      targetRotation.current.x += (mouse.current.y * 0.1 - targetRotation.current.x) * 0.05
      groupRef.current.rotation.y = targetRotation.current.y
      groupRef.current.rotation.x = targetRotation.current.x
    } else {
      groupRef.current.rotation.y += delta * 0.1
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
