import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef, type Ref } from "react";
import useGame from "./stores/useGame";
import { BufferGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial } from "three";

type SpaceshipProps = ThreeElements["group"] & { fullModule?: boolean, ref?: Ref<Group>};


export default function Spaceship({fullModule = true, ref, ...props }: SpaceshipProps) {

  const { nodes } = useGLTF('/models/spaceship_V2.glb');
  const rotorFrontMesh = nodes.rotorFront as Mesh;
  const rotorBackMesh = nodes.rotorBack as Mesh;
  const spaceshipMesh = nodes.spaceship as Mesh;
  const rotorFrontLightMesh = nodes.rotorFront_light as Mesh;
  const powerLightMesh = nodes.power_light as Mesh;
  const rotorBackLight = nodes.rotorBack_light as Mesh;

  const rotorFront = useRef<Mesh>(null!);
  const rotorBack = useRef<Mesh<BufferGeometry, MeshStandardMaterial | MeshBasicMaterial>>(null!);

  // powerUp feature
  const {velocity} = useGame();

  // animations
  useFrame((_, delta) => {
    // power up feature

    // update rotation
    rotorFront.current.rotation.x += velocity * delta;
    if(fullModule)
      rotorBack.current.rotation.x -= velocity * delta;
  });

  return (
    <group ref={ref} {...props} dispose={null}>
      {props.children}
      <mesh
        ref={rotorFront}
        castShadow
        receiveShadow
        geometry={rotorFrontMesh.geometry}
      >
        <meshStandardMaterial roughness={0.2} metalness={0.6} />
        <mesh
          castShadow
          geometry={rotorFrontLightMesh.geometry}
        >
          <meshBasicMaterial color={"cyan"} />
        </mesh>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={spaceshipMesh.geometry}
        rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial roughness={0.2} metalness={0.6} />

        <mesh
          castShadow
          geometry={powerLightMesh.geometry}>
          <meshBasicMaterial color={"cyan"} />
        </mesh>
      </mesh>
      {fullModule && (<>
          <mesh
            ref={rotorBack}
            castShadow
            receiveShadow
            geometry={rotorBackMesh.geometry}
            >
            <meshStandardMaterial roughness={0.2} metalness={0.6} />
                
            <mesh
              castShadow
              geometry={rotorBackLight.geometry}
            >
                <meshBasicMaterial color={"cyan"}/>
                
            </mesh>
          </mesh>
        </>)}
      
    </group>
  )
}