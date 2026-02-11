import { extend, useFrame, type ThreeElements } from "@react-three/fiber"
import { useRef } from "react";
import type { Mesh, TorusGeometry } from "three";
import { shaderMaterial } from "@react-three/drei";
import vertexShader from "./shaders/wormHole/vertex.glsl";
import fragmentShader from "./shaders/wormHole/fragment.glsl";

//types
type SpaceDistorsionProps = ThreeElements["mesh"]

// shader
const WormHoleShaderMaterial = shaderMaterial(
    {uTime:0},
    vertexShader,
    fragmentShader,
    (material) => {
            if (material) {
                material.transparent = true;
            }
        }
);
extend({WormHoleShaderMaterial});


// MAIN
export default function WormHole(props: SpaceDistorsionProps) {

    

    const torus = useRef<Mesh<TorusGeometry>>(null!);

    useFrame((_,delta)=> {
        // change position
        //torus.current.position.z += delta;
        // shader
        torus.current.material.uTime += delta;
        // rotate constantly
        //torus.current.rotation.z -= 0.25 * delta;
    });


    return <mesh ref={torus} {...props}>
        <torusGeometry args={[4.8,1.8]} />
        <wormHoleShaderMaterial/>
    </mesh>
}