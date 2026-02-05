import { useGLTF } from "@react-three/drei";
import  { type ThreeElements } from "@react-three/fiber";

export default function Spaceship(props: ThreeElements["mesh"]) {
    const spaceship = useGLTF('/models/spaceship.glb');
    
    return <primitive {...props} object={spaceship.scene} scale={0.5} />;
}