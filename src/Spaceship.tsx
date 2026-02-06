import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";

type SpaceshipProps = ThreeElements["group"] & { velocity?: number, acceleration?: number }

const maxVelocity = 25;

export default function Spaceship({ velocity: initialVelocity = 0.2, acceleration = 1/100, ...props }: SpaceshipProps) {

  const { nodes } = useGLTF('/models/spaceship_V2.glb');

  const rotorFront = useRef(null);
  const rotorBack = useRef(null);

  // powerUp feature
  const velocity = useRef(initialVelocity);

  // CONTROLS
  const [, getKeys] = useKeyboardControls();

  // animations
  useFrame((_, delta) => {
    const { powerUp } = getKeys();
    // power up feature
    if (powerUp){
      velocity.current += (maxVelocity - velocity.current ) * acceleration * delta;
    } else {
      velocity.current += (initialVelocity - velocity.current ) * acceleration * delta;
    }

    // update rotation
    rotorFront.current.rotation.x += velocity.current * delta;
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