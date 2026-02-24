import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import SceneManager from './scenes/SceneManager.tsx'
import MainUI from './UI/MainUI.tsx'
import preload from './preload.ts'
import { globals } from './utils.ts'

// PRELOAD ASSETS
preload();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainUI />
    <KeyboardControls map={[{ name: "powerUp", keys: ["Space"] }]}>
      <Canvas
        shadows
        camera={{ position: globals.isMobile ? [1, 0, 3.5] : [1,0,1.5], far: 500, near: 0.1 }}
        gl={{ antialias: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0, -20)}
      >
        <SceneManager />
      </Canvas>
    </KeyboardControls>
  </StrictMode>,
)
