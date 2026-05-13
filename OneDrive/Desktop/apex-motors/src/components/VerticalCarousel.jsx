import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Preload } from '@react-three/drei'
import { CarModel } from './CarModel'
import { CARS } from '../data/cars'
import * as THREE from 'three'

// Vertical spacing between cars in 3D space
export const SPACING_Y = 15;

export function VerticalCarousel({ activeIndex, scrollProgress }) {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    // Smoothly move the entire group UP as we scroll down
    // targetY is positive because cars are placed at negative Y.
    // scrollProgress goes from 0 to 1
    const targetY = scrollProgress * (CARS.length - 1) * SPACING_Y;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.08
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
      />
      <spotLight position={[-5, 8, -5]} angle={0.4} penumbra={1} intensity={1.5} color="#8888ff" />
      <pointLight position={[0, -2, 4]} intensity={0.8} color="#ffffff" />

      <group ref={groupRef}>
        {CARS.map((car, i) => {
          const y = -i * SPACING_Y;
          const isActive = i === activeIndex
          
          // Render only the active car and its immediate neighbors to save performance
          if (Math.abs(activeIndex - i) > 1) return null;

          return (
            <group key={car.id} position={[0, y, 0]}>
              <CarModel
                modelPath={car.modelPath}
                isActive={isActive}
                position={[0, 0, 0]}
                scale={1.4}
                opacity={isActive ? 1 : 0.3}
              />
              <ContactShadows
                position={[0, -0.6, 0]}
                opacity={0.6}
                scale={15}
                blur={2.5}
                far={5}
                color="#000000"
                resolution={512}
                frames={1}
              />
            </group>
          )
        })}
      </group>
    </>
  )
}
