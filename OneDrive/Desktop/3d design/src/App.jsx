import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Carousel, CARS_DATA } from './components/Carousel'

export default function App() {
  const [activeId, setActiveId] = useState(0)
  const activeCar = CARS_DATA[activeId]
  const currentColor = activeCar.color

  // Smooth background radial glow transition
  useEffect(() => {
    // We update a CSS variable on the body so the gradient can animate smoothly
    document.body.style.setProperty('--glow-color', currentColor)
    document.body.style.background = `radial-gradient(circle at 50% 50%, var(--glow-color) 0%, #050505 60%)`
    // Adding a subtle transition to the body background via CSS in index.css doesn't work for radial-gradient directly,
    // but the Tailwind overlay is a better approach. 
  }, [currentColor])

  return (
    <>
      {/* Background glow overlay for smooth color transition */}
      <div 
        className="fixed inset-0 pointer-events-none transition-colors duration-1000 ease-in-out"
        style={{ background: `radial-gradient(circle at 50% 50%, ${currentColor}30 0%, transparent 60%)` }}
      />

      {/* The 3D Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.4} />
          
          <rectAreaLight 
            width={10} 
            height={10} 
            color={currentColor} 
            intensity={2} 
            position={[0, 5, -5]} 
            lookAt={[0, 0, 0]} 
          />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

          <Suspense fallback={null}>
            <Carousel activeId={activeId} setActiveId={setActiveId} />
            <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={20} blur={2} far={4} />
            {/* The Environment map creates realistic reflections on the metal parts */}
            <Environment preset="city" background={false} />
          </Suspense>
        </Canvas>
      </div>

      {/* The fake scroll container that drives GSAP */}
      <div 
        className="scroll-container relative z-10 w-full"
        style={{ height: '400vh' }} // 400vh gives plenty of scroll room to rotate the wheel
      />

      {/* The UI Layer */}
      <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-8 lg:p-12">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="font-display font-bold text-2xl tracking-widest uppercase">
            NEX SUPERCARS
          </div>
          <nav className="hidden md:flex gap-8 font-sans text-sm tracking-widest text-white/60 uppercase">
            <span className="hover:text-white transition-colors cursor-pointer pointer-events-auto">Showroom</span>
            <span className="hover:text-white transition-colors cursor-pointer pointer-events-auto">Experience</span>
            <span className="hover:text-white transition-colors cursor-pointer pointer-events-auto">Configure</span>
          </nav>
        </header>

        {/* Center UI Layout */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl">
          
          {/* Glassmorphism Panel anchored to active car info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCar.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel p-8 rounded-3xl w-max relative overflow-hidden"
            >
              {/* Subtle accent line inside the card */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-1000" 
                style={{ backgroundColor: currentColor }} 
              />
              
              <div className="pl-4">
                <h2 className="font-display text-sm text-white/50 tracking-widest mb-2">
                  {activeCar.year}
                </h2>
                <h1 className="font-display font-bold text-5xl lg:text-7xl tracking-tighter mb-4">
                  {activeCar.name}
                </h1>
                <p className="font-sans text-lg text-white/70 tracking-wide font-light">
                  {activeCar.tagline}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Footer / Scroll Hint */}
        <footer className="flex justify-center pb-4">
          <div className="flex flex-col items-center opacity-50 animate-pulse">
            <span className="font-sans text-xs tracking-widest uppercase mb-2">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-white" />
          </div>
        </footer>

      </div>
    </>
  )
}
