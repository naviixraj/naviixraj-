import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useProgress } from '@react-three/drei'
import { Header } from './components/Header'
import { BackgroundEffects } from './components/BackgroundEffects'
import { LoadingScreen } from './components/LoadingScreen'
import { Home } from './pages/Home'
import { CarDetails } from './pages/CarDetails'
import './index.css'

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { progress } = useProgress()
  const location = useLocation()

  // Update loaded state when progress reaches 100
  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setIsLoaded(true), 600)
    }
  }, [progress])

  return (
    <>
      <AnimatePresence>
        {!isLoaded && <LoadingScreen progress={progress} />}
      </AnimatePresence>

      <BackgroundEffects />
      <Header />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home isLoaded={isLoaded} progress={progress} />} />
          <Route path="/car/:id" element={<CarDetails />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
