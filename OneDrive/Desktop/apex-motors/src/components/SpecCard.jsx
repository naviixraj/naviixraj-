import { motion, AnimatePresence } from 'framer-motion'

export function SpecCard({ car, visible }) {
  const specEntries = Object.entries(car.specs)

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={car.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: '16px',
            padding: '24px',
            minWidth: '220px',
          }}
        >
          {/* Accent top border */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              right: '20%',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${car.color}, transparent)`,
              borderRadius: '999px',
            }}
          />

          <div style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Performance
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {specEntries.map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {key}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter, sans-serif' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
