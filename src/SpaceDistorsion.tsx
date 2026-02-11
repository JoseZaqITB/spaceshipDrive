import { useFrame, type ThreeElements } from "@react-three/fiber"
import { useRef } from "react";
import type { Mesh } from "three";
import useGame from "./stores/useGame";
import { globals } from "./utils";

type SpaceDistorsionProps = ThreeElements["mesh"]

export default function SpaceDistorsion(props: SpaceDistorsionProps) {

    const velocity = useGame((state) => state.velocity);

    const torus = useRef<Mesh>(null!);
    useFrame((_,delta)=> {
        /*Update opacity by velocity*/
        torus.current.material.opacity = Math.pow(velocity / globals.MAXVELOCITY,6);
        // rotate constantly
        torus.current.rotation.z -= 0.25 * delta;
    });


    return <mesh ref={torus} {...props}>
        <torusGeometry args={[2.4,1]} />
        <meshStandardMaterial metalness={1} roughness={0} opacity={0} transparent />
    </mesh>
}