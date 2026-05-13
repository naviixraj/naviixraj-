import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollOrbit(totalCars, onIndexChange) {
  const rotationRef = useRef({ angle: 0 })
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current || document.body,
      start: 'top top',
      end: `+=${totalCars * 600}`,
      pin: true,
      scrub: 1.2,
      onUpdate: (self) => {
        const newAngle = self.progress * Math.PI * 2 * (totalCars / totalCars)
        rotationRef.current.angle = self.progress * Math.PI * 2

        const activeIndex = Math.round(self.progress * (totalCars - 1)) % totalCars
        onIndexChange(activeIndex)
      },
    })

    return () => trigger.kill()
  }, [totalCars, onIndexChange])

  return { rotationRef, scrollContainerRef }
}
