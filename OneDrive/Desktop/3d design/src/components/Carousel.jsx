import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Car } from './Car'

gsap.registerPlugin(ScrollTrigger)

export const CARS_DATA = [
  { id: 0, path: '/models/1969_ford_mustang_mach-1_428_cobra_jet/scene.gltf', color: '#ff003c', name: 'Mustang Mach-1', year: '1969', tagline: 'American Muscle at its Peak', scale: 1, yOffset: -0.5 },
  { id: 1, path: '/models/1971_corvette_c3_stingray_t-top_350/scene.gltf', color: '#ff8800', name: 'Corvette C3 Stingray', year: '1971', tagline: 'The Classic Curve', scale: 1, yOffset: -0.5 },
  { id: 2, path: '/models/1973_chevrolet_corvette_convertible_454/scene.gltf', color: '#ffcc00', name: 'Corvette Convertible', year: '1973', tagline: 'Wind in your Hair', scale: 1, yOffset: -0.5 },
  { id: 3, path: '/models/1982_porsche_930_911_turbo_3.3/scene.gltf', color: '#00ff44', name: 'Porsche 911 Turbo', year: '1982', tagline: 'The Widowmaker', scale: 1, yOffset: -0.5 },
  { id: 4, path: '/models/1992_porsche_911_964_turbo_s_3.6/scene.gltf', color: '#00ffee', name: 'Porsche 964 Turbo S', year: '1992', tagline: 'Refined Power', scale: 1, yOffset: -0.5 },
  { id: 5, path: '/models/2018_vertex_ridge_s14_silvia_kouki/scene.gltf', color: '#0088ff', name: 'Silvia S14 Kouki', year: '2018', tagline: 'Drift Legend', scale: 1, yOffset: -0.5 },
  { id: 6, path: '/models/2019_porsche_718_boxster_t/scene.gltf', color: '#8800ff', name: 'Porsche 718 Boxster T', year: '2019', tagline: 'Modern Precision', scale: 1, yOffset: -0.5 },
  { id: 7, path: '/models/2023_ares_panther_progettouno/scene.gltf', color: '#ff00ff', name: 'Ares Panther', year: '2023', tagline: 'Retro Futurism', scale: 1, yOffset: -0.5 },
  { id: 8, path: '/models/2023_lbsuper_silhouette_s15_silvia/scene.gltf', color: '#ff0088', name: 'LB Silhouette S15', year: '2023', tagline: 'Widebody Aggression', scale: 1, yOffset: -0.5 },
  { id: 9, path: '/models/ford_mustang_v__s197_ps1_styled/scene.gltf', color: '#ffffff', name: 'Mustang S197 (PS1 Style)', year: '2005', tagline: 'Low Poly Charm', scale: 1, yOffset: -0.5 },
]

export function Carousel({ activeId, setActiveId }) {
  const groupRef = useRef()
  const numCars = CARS_DATA.length
  
  // Elliptical path radius
  const radiusY = 8
  const radiusZ = 6

  const positions = useMemo(() => {
    return CARS_DATA.map((_, i) => {
      const angle = (i / numCars) * Math.PI * 2
      const y = Math.sin(angle) * radiusY
      const z = Math.cos(angle) * radiusZ
      return { 
        position: [0, y, z], 
        // We angle them slightly down as they go up the wheel
        rotation: [(Math.PI/2) * Math.sin(angle), 0, 0] 
      }
    })
  }, [numCars])

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // smooth scrubbing
        onUpdate: (self) => {
          // Total rotation for 1 full revolution over the scroll height
          const rotationAngle = self.progress * Math.PI * 2
          
          if(groupRef.current) {
            groupRef.current.rotation.x = rotationAngle
          }

          // Determine which car is closest to the front (positive Z)
          let closestDist = -Infinity
          let closestId = 0

          CARS_DATA.forEach((car, i) => {
            const angle = (i / numCars) * Math.PI * 2 + rotationAngle
            const z = Math.cos(angle) * radiusZ
            if(z > closestDist) {
              closestDist = z
              closestId = i
            }
          })

          if(closestId !== activeId) {
            setActiveId(closestId)
          }
        }
      })
    })
    return () => ctx.revert()
  }, [activeId, numCars, setActiveId])

  return (
    <group ref={groupRef}>
      {CARS_DATA.map((car, i) => {
        const isActive = activeId === car.id
        
        // Calculate the scale and opacity based on active state
        // When active, scale to 1. When inactive, scale down slightly
        const itemScale = isActive ? 1 : 0.6
        
        return (
          <group 
            key={car.id} 
            position={positions[i].position} 
            rotation={positions[i].rotation}
          >
            {/* The wrapper scales the whole item. */}
            <group scale={itemScale}>
              <Car 
                path={car.path} 
                isActive={isActive} 
                scale={car.scale}
                yOffset={car.yOffset}
              />
            </group>
          </group>
        )
      })}
    </group>
  )
}
