import { Suspense, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei'
import { motion } from 'framer-motion'
import { CARS } from '../data/cars'
import { SpecCard } from '../components/SpecCard'
import { useGLTF } from '@react-three/drei'

export function CarDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const car = CARS.find(c => c.id === parseInt(id))

  useEffect(() => {
    if (car) {
      document.documentElement.style.setProperty('--bg-gradient', car.bgGradient);
      document.documentElement.style.setProperty('--glow-color', car.glowColor);
    }
  }, [car])

  if (!car) {
    return <div style={{ color: 'white' }}>Car not found</div>
  }

  // A simplified car model component that just renders the GLTF for orbit controls
  const StaticCarModel = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath)
    return <primitive object={scene} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'absolute', inset: 0, zIndex: 1, width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: '100px', left: '48px', zIndex: 20 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: 0,
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.target.style.color = '#ffffff'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
        >
          ← Back to Showcase
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: '24px' }}
        >
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(40px, 6vw, 80px)',
            lineHeight: '1',
            color: '#ffffff',
            letterSpacing: '2px',
            textShadow: `0 0 60px ${car.glowColor}`,
          }}>
            {car.name}
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: '300',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginTop: '10px',
          }}>
            {car.tagline}
          </div>
          <div style={{
              height: '2px',
              width: '80px',
              background: car.color,
              marginTop: '16px',
              borderRadius: '999px',
              boxShadow: `0 0 12px ${car.color}`,
            }} />
        </motion.div>
      </div>

      <Canvas
        camera={{ position: [-5, 2, 8], fov: 45 }}
        style={{ position: 'absolute', inset: 0, zIndex: 10 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <spotLight position={[5, 8, 5]} angle={0.3} penumbra={1} intensity={3} />
          <spotLight position={[-5, 8, -5]} angle={0.4} penumbra={1} intensity={1.5} color="#8888ff" />
          
          <group position={[0, -1, 0]}>
            <StaticCarModel modelPath={car.modelPath} />
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.7}
              scale={20}
              blur={2}
              far={5}
              color="#000000"
              resolution={1024}
              frames={1}
            />
          </group>

          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={2.5} // Fast rotation speed
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below ground
          />
        </Suspense>
      </Canvas>

      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '48px',
        zIndex: 20,
      }}>
        <SpecCard car={car} visible={true} />
      </div>
      
      {/* Draggable hint */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        pointerEvents: 'none',
        fontFamily: 'Inter, sans-serif',
        fontSize: '10px',
        letterSpacing: '3px',
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '14px' }}>↔</span> Drag to rotate
      </div>
    </motion.div>
  )
}
