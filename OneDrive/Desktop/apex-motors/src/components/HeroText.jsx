import { motion, AnimatePresence } from 'framer-motion'

export function HeroText({ car }) {
  return (
    <div style={{ pointerEvents: 'none' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={car.id}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Car number */}
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '120px',
            lineHeight: '0.85',
            color: 'rgba(255,255,255,0.04)',
            letterSpacing: '-2px',
            marginBottom: '-20px',
            userSelect: 'none',
          }}>
            {String(car.id + 1).padStart(2, '0')}
          </div>

          {/* Car name */}
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px, 5vw, 68px)',
            lineHeight: '1',
            color: '#ffffff',
            letterSpacing: '2px',
            textShadow: `0 0 60px ${car.glowColor}`,
          }}>
            {car.name}
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: '300',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginTop: '10px',
            }}
          >
            {car.tagline}
          </motion.div>

          {/* Color accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              originX: 0,
              height: '2px',
              width: '80px',
              background: car.color,
              marginTop: '16px',
              borderRadius: '999px',
              boxShadow: `0 0 12px ${car.color}`,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
