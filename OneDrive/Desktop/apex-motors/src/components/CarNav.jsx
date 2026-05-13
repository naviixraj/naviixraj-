import { motion } from 'framer-motion'
import { CARS } from '../data/cars'

export function CarNav({ activeIndex, onSelect }) {
  return (
    <nav 
      aria-label="Car Selection"
      style={{
        position: 'fixed',
        right: '32px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 100,
      }}
    >
      {CARS.map((car, i) => (
        <motion.button
          key={car.id}
          onClick={() => onSelect(i)}
          aria-label={`Select ${car.name}`}
          aria-current={activeIndex === i ? "true" : "false"}
          animate={{
            width: activeIndex === i ? '28px' : '8px',
            opacity: activeIndex === i ? 1 : 0.3,
            backgroundColor: activeIndex === i ? car.color : '#ffffff',
          }}
          transition={{ duration: 0.3 }}
          style={{
            height: '8px',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
          }}
          title={car.name}
        />
      ))}
    </nav>
  )
}
