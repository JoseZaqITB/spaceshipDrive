import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Experience from './Experience.tsx'
import { Canvas } from '@react-three/fiber'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Canvas 
    camera={{ position: [2, 0, 4], far: 100 } }
    onCreated={({camera}) => camera.lookAt(0,0,-20)}
    >
      <Experience />
    </Canvas>
  </StrictMode>,
)
