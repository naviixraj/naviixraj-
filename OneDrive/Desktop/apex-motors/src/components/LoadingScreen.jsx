import { motion } from 'framer-motion'

export function LoadingScreen({ progress }) {
  // Ensure progress defaults to 0 and formats correctly
  const displayProgress = Math.round(progress || 0);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#08080c',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '48px',
        letterSpacing: '12px',
        color: '#ffffff',
        marginBottom: '8px',
      }}>
        APEX MOTORS
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        letterSpacing: '4px',
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        marginBottom: '48px',
      }}>
        Loading 3D Models
      </div>

      {/* Progress bar */}
      <div style={{
        width: '200px',
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '999px',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.3 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #e74c3c, #8e44ad)',
          }}
        />
      </div>

      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.2)',
        marginTop: '12px',
        letterSpacing: '2px',
      }}>
        {displayProgress}%
      </div>
    </motion.div>
  )
}
