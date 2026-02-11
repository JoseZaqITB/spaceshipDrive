import type { Object3DNode } from "three/webgpu"

declare module '*.glsl' {
  const source: string
  export default source
}

/* declare global {
  namespace JSX {
    interface IntrinsicElements {
      starMaterial: Object3DNode<StarMaterial, typeof StarMaterial>
    }
  }
} */