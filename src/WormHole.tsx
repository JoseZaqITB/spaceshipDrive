import { useFrame, type ThreeElements } from "@react-three/fiber"
import { useRef } from "react";
import { WormHoleShaderMaterial, type WormHoleInstance } from "./shaders/wormHole/WormHoleShaderMaterial";


//types
type SpaceDistorsionProps = ThreeElements["mesh"]

// shader



// MAIN
export default function WormHole(props: SpaceDistorsionProps) {

    

    const wormHoleShader = useRef<WormHoleInstance>(null!);

    useFrame((_,delta)=> {
        // change position
        //torus.current.position.z += delta;
        // shader
        wormHoleShader.current.uTime += delta;
        // rotate constantly
        //torus.current.rotation.z -= 0.25 * delta;
    });


    return <mesh {...props}>
        <torusGeometry args={[4.8,1.8]} />
        <primitive ref={wormHoleShader} object={new WormHoleShaderMaterial()} attach={"material"} />
    </mesh>
}