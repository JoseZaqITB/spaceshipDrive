import { OrbitControls, Environment, CameraShake, useHelper, SoftShadows, BakeShadows, type ShakeController, useKeyboardControls } from "@react-three/drei"
import Spaceship from "./Spaceship"
import Stars from "./Stars"
import { Suspense, useRef, useState } from "react"
import { Perf } from "r3f-perf"
import { DirectionalLightHelper, MathUtils } from "three"
import { useControls } from "leva"
import { useFrame } from "@react-three/fiber"
import { globals } from "./utils"

const initialVelocity = 0.2;
const acceleration = 1/2;

function Experience() {
  const directionalLight = useRef(null);

  // debug
  const debugObject = useControls({
    sunPosition: [2, 1, 3],
    size: 10,
    samples: 20,
    focus: 0,
  });
  /* useHelper(directionalLight, DirectionalLightHelper, 1); */

  // shake animation
  const shake = useRef<ShakeController>(null);
  const velocity = useRef(initialVelocity);

  const [, getKeys] = useKeyboardControls();

  useFrame((_, delta) => {

    const {powerUp} = getKeys();

    // power up feature
    if (powerUp){
      velocity.current += (globals.MAXVELOCITY - velocity.current ) * acceleration * delta;
    } else {
      velocity.current += (initialVelocity - velocity.current ) * acceleration * delta;
    }
    // set intensity
    const v = velocity.current

    // map velocity → shake (ease-in)
    const target = MathUtils.clamp(
      (v / globals.MAXVELOCITY) ** 2,
      0,
      1
    )

    // smooth it
    const current = shake.current.getIntensity()
    const smoothed = MathUtils.lerp(
      current,
      target,
      1 - Math.exp(-delta * 8)
    )

    shake.current.setIntensity(smoothed)
  })
  //
  return (
    <>
      <Perf position="top-left" />
      {<CameraShake ref={shake} decay={false} intensity={10} maxYaw={0.003} maxPitch={0.003} maxRoll={0.003} yawFrequency={5} pitchFrequency={5} rollFrequency={4} />}
      <color attach="background" args={['black']} />
      <Environment background environmentIntensity={20} files={"assets/HDR_subdued_blue_nebulae_lower_res.hdr"} />
      <OrbitControls />
      {/* Lights and shadows */}
      <SoftShadows size={debugObject.size} samples={debugObject.samples} focus={debugObject.focus} />
      <directionalLight
        ref={directionalLight}
        castShadow
        position={debugObject.sunPosition}
        intensity={1}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        shadow-camera-near={0.1}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-camera-left={-3}
        shadow-camera-right={3}
      />´
      {/* <mesh castShadow position={[10,10,20]} scale={10}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh> */}
      {/* meshes */}
      <Suspense>
        {/* <BakeShadows /> */} {/* // the shadow lights dont move :) */}
        <Spaceship rotation={[0, Math.PI * 0.5, 0]} position={[0, 0, 0]} velocity={initialVelocity} acceleration={acceleration} />
        <Stars count={1000} radius={2} depth={50} velocity={initialVelocity} maxSize={2} acceleration={acceleration} />
      </Suspense>
      {/* Shaders */}

    </>
  )
}

export default Experience
