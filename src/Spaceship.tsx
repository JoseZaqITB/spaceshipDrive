import { useGLTF } from "@react-three/drei";
import  { useFrame, type ThreeElements } from "@react-three/fiber";

type SpaceshipProps = ThreeElements["mesh"] & {velocity: number}

export default function Spaceship({velocity = 0.2,...props}: SpaceshipProps) {
    const spaceship = useGLTF('/models/spaceship_V2.glb');
    console.log(spaceship.nodes);
    useFrame((_, delta) => {   
        spaceship.nodes.rotorBack.rotation.x -= velocity * delta;
        spaceship.nodes.rotorFront.rotation.x += velocity *  delta;
    });
    
    return <primitive {...props} object={spaceship.scene} scale={0.5} />;
}