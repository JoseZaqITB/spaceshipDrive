import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Experience from './Experience.tsx'
import { Canvas } from '@react-three/fiber'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Canvas>
      <Experience />
    </Canvas>
  </StrictMode>,
)
