import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Preload } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { CARS } from '../data/cars'
import { VerticalCarousel } from '../components/VerticalCarousel'
import { HeroText } from '../components/HeroText'

gsap.registerPlugin(ScrollTrigger)

export function Home({ isLoaded, progress }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  const activeCar = CARS[activeIndex]

  // Update global background color when active index changes
  useEffect(() => {
    // We update the CSS variable directly on document root for smooth cross-page backgrounds
    document.documentElement.style.setProperty('--bg-gradient', activeCar.bgGradient);
    document.documentElement.style.setProperty('--glow-color', activeCar.glowColor);
  }, [activeCar])

  useEffect(() => {
    if (!isLoaded || !scrollRef.current) return

    const totalHeight = CARS.length * 100 // vh
    
    const trigger = ScrollTrigger.create({
      trigger: scrollRef.current,
      start: 'top top',
      end: `bottom bottom`,
      scrub: 1.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress)
        const newIndex = Math.min(
          Math.round(self.progress * (CARS.length - 1)),
          CARS.length - 1
        )
        setActiveIndex(newIndex)
      },
    })

    return () => trigger.kill()
  }, [isLoaded])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
    >
      {/* Scroll container */}
      <div
        ref={scrollRef}
        style={{
          position: 'relative',
          height: `${CARS.length * 100}vh`,
          width: '100vw',
        }}
      >
        {/* Fixed Viewport for 3D and UI */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2,
          pointerEvents: 'none', // let scroll events pass through
        }}>
          
          {/* 3D Canvas */}
          <Canvas
            camera={{ position: [0, 1.5, 10], fov: 45 }}
            style={{ position: 'absolute', inset: 0 }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <VerticalCarousel
                activeIndex={activeIndex}
                scrollProgress={scrollProgress}
              />
              <Preload all />
            </Suspense>
          </Canvas>

          {/* Bottom fade overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to top, rgba(8,8,12,0.9) 0%, transparent 100%)',
          }} />

          {/* Hero text */}
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '48px',
            zIndex: 10,
          }}>
            <HeroText car={activeCar} />
          </div>

          {/* View Details Button Overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '15%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            pointerEvents: 'auto', // Re-enable pointer events for the button
          }}>
             <AnimatePresence mode="wait">
              <motion.button
                key={activeCar.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => navigate(`/car/${activeCar.id}`)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid rgba(255,255,255,0.1)`,
                  borderRadius: '30px',
                  padding: '16px 32px',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: `0 0 20px ${activeCar.glowColor}`,
                  transition: 'background 0.3s',
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
              >
                View Details
              </motion.button>
            </AnimatePresence>
          </div>

          {/* Scroll hint */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
            opacity: scrollProgress < 0.05 ? 1 : 0,
            transition: 'opacity 0.5s',
          }}>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '3px',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
            }}>
              Scroll to explore
            </div>
            <div style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
          </div>
          
        </div>
      </div>
    </motion.div>
  )
}
