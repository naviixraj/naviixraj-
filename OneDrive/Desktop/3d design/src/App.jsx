import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, useCursor, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import './index.css'

// A placeholder 3D model representing the "Car"
function PlaceholderCar({ color, setBgColor }) {
  const group = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  // Mouse interaction logic (tilting based on mouse position)
  const { mouse } = useThree()
  useFrame((state, delta) => {
    // Smoothly interpolate the group rotation based on mouse coordinates
    const targetX = (mouse.y * Math.PI) / 8
    const targetY = (mouse.x * Math.PI) / 8
    
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta)
  })

  // Handle Exhaust Click (Audio + Animation)
  const handleExhaustClick = (e) => {
    e.stopPropagation()
    
    // Play sound (using a placeholder beep if no file provided yet)
    // In reality, this would be an AudioContext or HTMLAudioElement
    const synth = new window.AudioContext()
    const osc = synth.createOscillator()
    const gain = synth.createGain()
    osc.connect(gain)
    gain.connect(synth.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(50, synth.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, synth.currentTime + 0.5)
    gain.gain.setValueAtTime(0.5, synth.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, synth.currentTime + 0.5)
    osc.start()
    osc.stop(synth.currentTime + 0.5)

    // Visual "Shake" using GSAP
    gsap.fromTo(group.current.position, 
      { y: 0.1 }, 
      { y: 0, duration: 0.1, yoyo: true, repeat: 5, ease: "power1.inOut" }
    )
  }

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Main Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 0.8, 2.5]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Exhaust (The interactive part) */}
      <mesh 
        position={[0.6, 0.2, 1.2]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleExhaustClick}
        castShadow
      >
        <cylinderGeometry args={[0.1, 0.1, 0.8, 32]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

export default function App() {
  const [currentColor, setCurrentColor] = useState('#ff003c') // Ducati Red default
  const [fontWeight, setFontWeight] = useState(400)
  
  // Adaptive Background Shift based on mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      
      // Update CSS variables for radial gradient center
      document.body.style.background = `radial-gradient(circle at ${x}% ${y}%, ${currentColor}40 0%, #050505 70%)`
      
      // Variable Typography adjustment
      // Mapping horizontal mouse movement to font weight (100 to 900)
      const weight = Math.round(100 + (x / 100) * 800)
      setFontWeight(weight)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [currentColor])

  return (
    <>
      <div className="canvas-container">
        <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          {/* Adaptive lighting that matches the bike color */}
          <rectAreaLight 
            width={10} 
            height={10} 
            color={currentColor} 
            intensity={2} 
            position={[0, 5, -5]} 
            lookAt={[0, 0, 0]} 
          />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
          
          <PlaceholderCar color={currentColor} setBgColor={setCurrentColor} />
          
          {/* Contact Shadows for realism */}
          <ContactShadows position={[0, 0, 0]} opacity={0.7} scale={10} blur={2} far={4} />
          
          {/* Environment Map for reflections */}
          <Environment preset="city" />
        </Canvas>
      </div>

      <div className="ui-layer" style={{ fontFamily: `'Inter', sans-serif`, fontVariationSettings: `'wght' ${fontWeight}` }}>
        <header className="header">
          <div className="logo">NEX SUPERCARS</div>
          <nav className="nav">
            <span>MODELS</span>
            <span>EXPERIENCE</span>
            <span>BUY</span>
          </nav>
        </header>

        <div className="hero-title">SUPERLEGGERA</div>

        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Top Speed</span>
            <span className="spec-value">299 KM/H</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Torque</span>
            <span className="spec-value">116 NM</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Engine</span>
            <span className="spec-value">998 CC</span>
          </div>
        </div>
        
        <div className="instruction">
          <p>Move mouse to interact.</p>
          <p>Click the exhaust for audio.</p>
        </div>
      </div>
    </>
  )
}
