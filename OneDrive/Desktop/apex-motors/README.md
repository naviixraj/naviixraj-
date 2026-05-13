# APEX MOTORS — Premium Car Showcase

A production-ready Vite + React + Three Fiber orbital carousel landing page for luxury car models.

## 🎯 Features

✨ **Orbital Carousel** — 7 stunning 3D car models arranged in a vertical elliptical Ferris wheel.  
🎨 **Dynamic Background** — Radial gradients shift smoothly to match each car's signature color.  
🖱️ **Mouse Tilt** — Active car subtly rotates toward cursor for immersive feel.  
📜 **GSAP ScrollTrigger** — Smooth scroll-driven orbit rotation with precise car transitions.  
🎭 **Glassmorphism UI** — Premium frosted-glass spec cards with backdrop blur.  
⚡ **Performance Optimized** — Lazy loading, LOD scaling, efficient animations.  
🔥 **Responsive** — Works on desktop, tablet, and mobile.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server runs on `http://localhost:5173`

## 📁 Project Structure

```
apex-motors/
├── src/
│   ├── components/
│   │   ├── OrbitalCarousel.jsx    # Ferris wheel 3D carousel
│   │   ├── CarModel.jsx            # Single car loader + mouse tilt
│   │   ├── SpecCard.jsx            # Glassmorphism info card
│   │   ├── HeroText.jsx            # Animated car name display
│   │   ├── CarNav.jsx              # Navigation dots
│   │   └── LoadingScreen.jsx       # Progress indicator
│   ├── hooks/
│   │   └── useScrollOrbit.js       # GSAP scroll logic
│   ├── data/
│   │   └── cars.js                 # Car metadata & specs
│   ├── App.jsx                     # Main layout & state
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
├── public/
│   └── models/                     # 3D car models (.gltf + textures)
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎮 How It Works

### Scroll Mechanic
- User scrolls down → GSAP ScrollTrigger tracks progress
- Progress updates `orbitAngle` (0 to 1)
- Group rotation smoothly eases to match scroll position
- Active car index updates, triggering UI animations

### Mouse Tilt
- `useFrame` hook in `CarModel` reads `mouse.x/y` position
- Active car rotation maps to cursor (clamped 45°)
- Smooth interpolation via Euler-based rotation

### Background Transition
- On active car change → `bgGradient` animates for 1.5s
- GSAP tween smooths color shift
- Radial gradient creates depth & focus

### Car Positions
Cars arranged on vertical ellipse using parametric equations:
```
y = sin(angle) × 3.5  // vertical radius
z = cos(angle) × 6    // depth radius
```
Opacity & scale based on distance from front.

## 🎨 Customization

### Edit Car Data
Open `src/data/cars.js`:
- Modify `name`, `tagline`, `specs`
- Update `color` and `glowColor` (hex/rgba)
- Adjust `bgGradient` for custom background
- Point to different `.gltf` paths in `public/models/`

### Tweak Orbit Parameters
In `src/components/OrbitalCarousel.jsx`:
```js
const ORBIT_RADIUS_Y = 3.5  // vertical spread
const ORBIT_RADIUS_Z = 6    // front-to-back spread
```

### Adjust Scroll Speed
In `src/App.jsx` ScrollTrigger:
```js
scrub: 1.5  // Change value to speed up/slow down
```

### Modify Camera
In `src/App.jsx` Canvas props:
```jsx
<Canvas camera={{ position: [0, 1, 10], fov: 45 }} />
```

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI framework |
| `three` | 3D graphics |
| `@react-three/fiber` | React-Three integration |
| `@react-three/drei` | High-level 3D components |
| `gsap` | Animation library |
| `framer-motion` | UI animation |
| `vite` | Build tool |

## 🖼️ 3D Models

All models must be `.gltf` format with embedded textures or external `/textures` folder.

### Adding New Cars
1. Extract `.gltf` + `/textures` to `public/models/my_car/`
2. Add entry to `CARS` array in `src/data/cars.js`
3. Adjust scale/position in `OrbitalCarousel.jsx` if needed

## ⚡ Performance Tips

- Use `.glb` (binary) instead of `.gltf` for smaller files
- Compress textures to ≤1MB per car
- Use `ContactShadows` sparingly (expensive)
- Enable LOD (level of detail) for complex models
- Test on mobile with DevTools throttling

## 🌐 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag 'dist' folder to Netlify
```

### Self-hosted (nginx)
```bash
npm run build
# Serve 'dist' folder as static site
```

## 📄 License

MIT — Free to use and modify.

---

**Built with ❤️ for car enthusiasts.**
