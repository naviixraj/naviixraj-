import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Preload } from '@react-three/drei'
import { CarModel } from './CarModel'
import { CARS } from '../data/cars'
import * as THREE from 'three'

const ORBIT_RADIUS_Y = 3.5  // vertical radius (height of oval)
const ORBIT_RADIUS_Z = 6    // depth radius (front-to-back)

export function OrbitalCarousel({ activeIndex, orbitAngle }) {
  const groupRef = useRef()

  // Positions on vertical ellipse
  const carPositions = useMemo(() => {
    return CARS.map((_, i) => {
      const angle = (i / CARS.length) * Math.PI * 2
      return angle
    })
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    // Smooth rotation toward orbitAngle
    const target = -orbitAngle * Math.PI * 2
    groupRef.current.rotation.x += (target - groupRef.current.rotation.x) * 0.04
  })

  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.3} />
      <spotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight position={[-5, 8, -5]} angle={0.4} penumbra={1} intensity={1.5} color="#8888ff" />
      <pointLight position={[0, -2, 4]} intensity={0.8} color="#ffffff" />

      <group ref={groupRef}>
        {CARS.map((car, i) => {
          const baseAngle = carPositions[i]
          const y = Math.sin(baseAngle) * ORBIT_RADIUS_Y
          const z = Math.cos(baseAngle) * ORBIT_RADIUS_Z
          const distFromFront = Math.abs(z - ORBIT_RADIUS_Z)
          const normalizedDist = distFromFront / (ORBIT_RADIUS_Z * 2)

          const isActive = i === activeIndex
          // Reduce rendering overhead for cars in the back by omitting them or lowering opacity drastically
          const scale = isActive ? 1.6 : THREE.MathUtils.lerp(0.6, 1.1, 1 - normalizedDist)
          const opacity = isActive ? 1 : THREE.MathUtils.lerp(0.15, 0.7, 1 - normalizedDist)
          
          // Do not render completely hidden cars behind the wheel to save draw calls
          if (normalizedDist > 0.9) return null;

          return (
            <CarModel
              key={car.id}
              modelPath={car.modelPath}
              isActive={isActive}
              position={[0, y, z]}
              scale={scale}
              opacity={opacity}
            />
          )
        })}
      </group>

      <ContactShadows
        position={[0, -4, 0]}
        opacity={0.5}
        scale={30}
        blur={2.5}
        far={10}
        color="#000000"
        resolution={512} // Optimize shadow resolution for performance
        frames={1}       // Bake shadows to avoid re-rendering every frame
      />
    </>
  )
}
