import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef, type Ref } from "react";
import useGame from "./stores/useGame";
import { BufferGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, NoColorSpace } from "three";

type SpaceshipProps = ThreeElements["group"] & { fullModule?: boolean, ref?: Ref<Group> };


export default function Spaceship({ fullModule = true, ref, ...props }: SpaceshipProps) {

  const { nodes } = useGLTF('models/spaceship_V3_UV_v3.glb');
  const rotorFrontMesh = nodes.rotorFront as Mesh;
  const rotorBackMesh = nodes.rotorBack as Mesh;
  const spaceshipMesh = nodes.spaceship as Mesh;
  const rotorFrontLightMesh = nodes.rotorFront_light as Mesh;
  const powerLightMesh = nodes.power_light as Mesh;
  const rotorBackLight = nodes.rotorBack_light as Mesh;
  const observationMesh = nodes.observation_ as Mesh;
  const observationWindowsMesh = nodes.observation_windows as Mesh;
  const engineSphereMesh = nodes.engine_sphere as Mesh;
  const engineInductorMesh = nodes.engine_inductor as Mesh;
  const panelsMesh = nodes.panels as Mesh;
  const panelsStickMesh = nodes.panels_stick as Mesh;
  const spaceshipWindowMesh = nodes.spaceship_window as Mesh;
  const residentialMesh = nodes.residential as Mesh;



  const rotorFront = useRef<Mesh>(null!);
  const rotorBack = useRef<Mesh<BufferGeometry, MeshStandardMaterial | MeshBasicMaterial>>(null!);

  // load normal
  const normalMap = useTexture("./assets/spaceship/spaceship_normal_v2.jpg", (txt) => {
    txt.flipY = false;
    txt.colorSpace = NoColorSpace;
  });

  // materials

  const metalMaterial = new MeshStandardMaterial({ color: 0xEEEEF9, metalness: 0.95, roughness: 0.25 });
  const metalNormalMaterial = new MeshStandardMaterial({ color: 0xEEEEF9, metalness: 0.95, roughness: 0.12, normalMap });
  const engineMaterial = new MeshStandardMaterial({ color: 0xEEEEF9, metalness: 0.85, roughness: 0.45, normalMap });
  const panelMaterial = new MeshStandardMaterial({ color: 0x34277C, metalness: 0.0, roughness: 0.2, normalMap });
  const windowMaterial = new MeshStandardMaterial({ color: 0x8F8FA3, metalness: 0.9, roughness: 0.0 });
  const lightMaterial = new MeshBasicMaterial({ color: "cyan" });

  // powerUp feature
  const { velocity } = useGame();

  // animations
  useFrame((_, delta) => {
    // power up feature

    // update rotation
    rotorFront.current.rotation.x += velocity * delta;
    if (fullModule)
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
        material={metalNormalMaterial}
      >

        <mesh
          castShadow
          geometry={rotorFrontLightMesh.geometry}
          material={lightMaterial}
        >

        </mesh>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={spaceshipMesh.geometry}
        material={metalNormalMaterial}
        rotation={[0, 0, -Math.PI / 2]}>
        <mesh
          castShadow
          material={lightMaterial}
          geometry={powerLightMesh.geometry}>

        </mesh>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={observationMesh.geometry}
        material={metalMaterial}
        position={[-17.4, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[1, 1.2, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={observationWindowsMesh.geometry}
        material={windowMaterial}
        position={[-17.4, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[1, 1.2, 1]}
      />

      <mesh
        castShadow
        receiveShadow
        geometry={engineSphereMesh.geometry}
        material={engineMaterial}
        position={[-13, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={engineInductorMesh.geometry}
        material={engineMaterial}
        position={[-10.4, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={panelsMesh.geometry}
        material={panelMaterial}
        position={[-6, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={panelsStickMesh.geometry}
          material={metalMaterial}
        >
      </mesh>

      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={spaceshipWindowMesh.geometry}
        material={windowMaterial}
        rotation={[0, 0, -Math.PI / 2]}
      />
      {fullModule && (<>
        <mesh
          castShadow
          receiveShadow
          geometry={residentialMesh.geometry}
          material={metalNormalMaterial}
          position={[-25.075, 0, 0]}
        />
        <mesh
          ref={rotorBack}
          castShadow
          receiveShadow
          geometry={rotorBackMesh.geometry}
          material={metalNormalMaterial}
        >
          <mesh
            castShadow
            geometry={rotorBackLight.geometry}
            material={lightMaterial}
          />

        </mesh>
      </>)}

    </group>
  )
}