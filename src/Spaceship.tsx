import { useGLTF } from "@react-three/drei";
import  { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";

type SpaceshipProps = ThreeElements["group"] & {velocity: number}

export default function Spaceship({velocity = 0.2,...props}: SpaceshipProps) {
    
    const { nodes } = useGLTF('/models/spaceship_V2.glb');

    const rotorFront = useRef(null);
    const rotorBack = useRef(null);

    useFrame((_, delta) => { 
        rotorFront.current.rotation.x += velocity *  delta;
        /* rotorBack.current.rotation.x -= velocity * delta; */
    });
  return (
    <group {...props} dispose={null} scale={0.1}>
      <mesh
        ref={rotorFront}
        castShadow
        receiveShadow
        geometry={nodes.rotorFront.geometry}
        >
            <meshStandardMaterial roughness={0.2} metalness={0.6} />
        <mesh
          castShadow
          geometry={nodes.rotorFront_light.geometry}
        >
            <meshBasicMaterial color={"cyan"}/>
        </mesh>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.spaceship.geometry}
        rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial roughness={0.2} metalness={0.6} />

        <mesh
          castShadow
          geometry={nodes.power_light.geometry}>
            <meshBasicMaterial color={"cyan"}/>
        </mesh>
      </mesh>
      {/* <mesh
        ref={rotorBack}
        castShadow
        receiveShadow
        geometry={nodes.rotorBack.geometry}
        >
        <meshStandardMaterial roughness={0.2} metalness={0.6} />
            
        <mesh
          castShadow
          geometry={nodes.rotorBack_light.geometry}
        >
            <meshBasicMaterial color={"cyan"}/>
            
        </mesh>
      </mesh> */}
    </group>
  )
}