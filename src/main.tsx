import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Experience from './Experience.tsx'
import { Canvas } from '@react-three/fiber'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Canvas 
    shadows
    camera={{ position: [1.5, 1, 2], far: 100, near: 0.1 } }
    gl={{antialias: true}}
    onCreated={({camera}) => camera.lookAt(0,0,-20)}
    >
      <Experience />
    </Canvas>
  </StrictMode>,
)
