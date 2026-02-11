import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import useGame from "./stores/useGame";
import { Mesh } from "three";

type SpaceshipProps = ThreeElements["group"];


export default function Spaceship({ ...props }: SpaceshipProps) {

  const { nodes } = useGLTF('/models/spaceship_V2.glb');

  const rotorFront = useRef<Mesh>(null!);
  const rotorBack = useRef(null);

  // powerUp feature
  const velocity = useGame((state)=> state.velocity);

  // animations
  useFrame((_, delta) => {
    // power up feature

    // update rotation
    rotorFront.current.rotation.x += velocity * delta;
    /* rotorBack.current.rotation.x -= velocity.current * delta; */
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
          <meshBasicMaterial color={"cyan"} />
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
          <meshBasicMaterial color={"cyan"} />
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