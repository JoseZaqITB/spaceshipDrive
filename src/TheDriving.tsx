import { Environment, CameraShake, useHelper, SoftShadows, BakeShadows, type ShakeController, useKeyboardControls } from "@react-three/drei"
import Spaceship from "./Spaceship"
import Stars from "./Stars"
import { Suspense, useLayoutEffect, useRef } from "react"
import { DirectionalLightHelper, MathUtils } from "three"
import { useControls } from "leva"
import { useFrame } from "@react-three/fiber"
import { globals } from "./utils"
import useGame from "./stores/useGame";
import SpaceDistorsion from "./SpaceDistorsion"
import WormHole from "./WormHole"
import BackgroundAudio from "./audioComponents/BackgroundAudio"
import DynamicAudio from "./audioComponents/DynamicAudio"

const acceleration = 1/2;

function TheDriving() {
  const directionalLight = useRef(null);
  // store
  const phase = useGame((state) => state.phase);
  const timer = useGame((state) => state.timer);
  const setPhase = useGame((state) => state.setPhase);
  const setTimer = useGame((state) => state.setTimer);
  // debug
  const debugObject = useControls({
    sunPosition: [2, 1, 3],
    size: 10,
    samples: 20,
    focus: 0,
    wormHolePosition: [0,0,-7],
  });
  /* useHelper(directionalLight, DirectionalLightHelper, 1); */
  
  // shake animation
  const shake = useRef<ShakeController>(null!);
  const velocity = useGame((state) => state.velocity);
  const setVelocity = useGame((state) => state.setVelocity);

  const [, getKeys] = useKeyboardControls();

  useLayoutEffect(() => {
    setVelocity(globals.INITIALVELOCITY); // initiate initial velocity value
  }, [setVelocity]);

  useFrame((_, delta) => {

    const {powerUp} = getKeys();

    /* power up feature */
    if (powerUp){
      setVelocity(velocity + (globals.MAXVELOCITY - velocity ) * acceleration * delta);
    } else {
      setVelocity(velocity + (globals.INITIALVELOCITY - velocity ) * acceleration * delta);
    }
    // set intensity
    const v = velocity

    // map velocity → shake (ease-in)
    const target = MathUtils.clamp((v / globals.MAXVELOCITY) ** 2,0,1 );

    // smooth it
    const current = shake.current.getIntensity()
    const smoothed = MathUtils.lerp(current,target,1 - Math.exp(-delta * 8))

    shake.current.setIntensity(smoothed)

    // PHASE MANAGE
    if(velocity >= globals.MAXVELOCITY - 1 && phase === "driving") {
      setPhase("passing"); // iniciar imagen de agujero de gusano
      setTimer(Date.now()); // iniciar contador
    }

    if(velocity >= globals.MAXVELOCITY - 1 && phase === "passing" && (Date.now() - timer) >= 1000) {
      setPhase("end"); // para cambiar de scena 
    }
  })
  //
  return (
    <>
      <BackgroundAudio />
      <BackgroundAudio url="public/audio/427504__solarphasing__industrial-noises-ambient-sound-1_v2.mp3" volume={3} />
      <DynamicAudio url="audio/47631__jovica__space-sweep-11_v2.mp3" />
      {<CameraShake ref={shake} decay={false} intensity={10} maxYaw={0.003} maxPitch={0.003} maxRoll={0.003} yawFrequency={5} pitchFrequency={5} rollFrequency={4} />}
      <color attach="background" args={['black']} />
      <Environment background environmentIntensity={20} files={"assets/HDR_subdued_blue_nebulae_lower_res.hdr"} />
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
        <Spaceship rotation={[0, Math.PI * 0.5, 0]} position={[0, 0, 0]} />
        <Stars position={[0,0,-20]} count={500} radius={2} depth={40} />
      </Suspense>
        <SpaceDistorsion/>

      {phase === "passing" && (<>
        <Suspense >
          <BackgroundAudio url="audio/521977__geistjon__drone-and-space-sounds-stylophone-gen-x-01_v2.mp3" speed={3} />
        </Suspense>
        <WormHole position={debugObject.wormHolePosition} />
      </>)}
  
    </>
  )
}

export default TheDriving
