import { Environment, CameraShake, SoftShadows, type ShakeController } from "@react-three/drei"
import { EffectComposer, ShockWave, ToneMapping} from "@react-three/postprocessing"
import {ShockWaveEffect, ToneMappingMode} from "postprocessing"
import Spaceship from "../Spaceship"
import Stars from "../Stars"
import { Suspense, useEffect, useRef, useState } from "react"
import {HalfFloatType, MathUtils } from "three"
import { Leva, useControls } from "leva"
import { useFrame, useThree } from "@react-three/fiber"
import { globals } from "../utils"
import useGame from "../stores/useGame";
import SpaceDistorsion from "../SpaceDistorsion"
import WormHole from "../WormHole"
import BackgroundAudio from "../audioComponents/BackgroundAudio"
import PowerUpAudio from "../audioComponents/PowerUpAudio"

function TheDriving() {
  const directionalLight = useRef(null);
  // store
  const phase = useGame((state) => state.phase);
  const setPhase = useGame((state) => state.setPhase);
  const setScene = useGame((state) => state.setScene);
  // debug
  const debugObject = useControls({
    sunPosition: [0.01, 0.01, -0.01], //[2, 1, 3]
    sunPosition2: [-0.01, -0.01, -0.01],
    size: 10,
    samples: 20,
    focus: 0,
    wormHolePosition: [0,0,-7],
  });
  /* useHelper(directionalLight, DirectionalLightHelper, 1); */
  
  // shockwave
  const shockWaveEffect = useRef<ShockWaveEffect>(null!);
  // shake animation
  const shake = useRef<ShakeController>(null!);
  const velocity = useGame((state) => state.velocity);
  const setVelocity = useGame((state) => state.setVelocity);

  const buttons = useGame((state) => state.buttons);
  // mouse movement
  const [isMouseActive, setIsMouseActive] = useState(false);
  const {camera, pointer} = useThree();
  const [initialCameraPos] = useState({...camera.position});

  useEffect(() => {
    // listeners
    const onClick = () => setIsMouseActive(true);
    const onDown = (e:KeyboardEvent) => {  if(e.code === "Escape") setIsMouseActive(false)};
    
    // desktop support
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onDown);

    return ()=> { 
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onDown);
      
    }
  },[]);

  useEffect(() => {
    setVelocity(globals.INITIALVELOCITY); // initiate initial velocity value
    return () => {
      setVelocity(globals.INITIALVELOCITY);
    }
  }, [setVelocity]);

  // change scene
  useEffect(() => {
    if(phase === "end"){
      setTimeout(() => {
        setScene("finalDestination");
      }, globals.transitionDelay * 1000)
    }
  },[phase]);
  //

  useFrame((_, delta) => {
    /* mouse movement */
    if(isMouseActive){
      camera.position.lerp({x:pointer.x * 0.1 + initialCameraPos.x , y:pointer.y * 0.1 + initialCameraPos.y,z:camera.position.z}, 0.01);
    }


    /* velocity update */
    const {powerUp, interact} = buttons;

    /* power up feature */
    if (powerUp){
      setVelocity(velocity + (globals.MAXVELOCITY - velocity ) * globals.DEFAULT_ACCELERATION * delta);
    } else if(phase === "driving"){
      setVelocity(velocity + (globals.INITIALVELOCITY - velocity ) * globals.DEFAULT_ACCELERATION * delta);
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
    }

    if(phase === "passing" && interact) {
      shockWaveEffect.current.explode();
      setPhase("end");
    }
  })
  //
  return (
    <>
      <Leva hidden />
      <color attach="background" args={['black']} />
      {/* audios */}
      <BackgroundAudio url="audio/214663__hykenfreak__deep-space-ship-effect_v3.mp3" />
      <BackgroundAudio url="audio/427504__solarphasing__industrial-noises-ambient-sound-1_v2.mp3" volume={3} />
      <PowerUpAudio url="audio/47631__jovica__space-sweep-11_v2.mp3" />
      {/*Effects*/}
      {<CameraShake ref={shake} decay={false} intensity={10} maxYaw={0.003} maxPitch={0.003} maxRoll={0.003} yawFrequency={5} pitchFrequency={5} rollFrequency={4} />}
       
        <EffectComposer enabled={phase !== "driving"} multisampling={ 4 } frameBufferType={HalfFloatType} >
          <ShockWave  
            ref={shockWaveEffect}
            position={[1, 0, -2]}
            size={0.3}
            extent={5}
            speed={0.25}         
            waveSize={1}      
            amplitude={0.05}    
           />
          {/* Default */}
          <ToneMapping mode={ ToneMappingMode.LINEAR  } />
        </EffectComposer>

      <Environment background environmentIntensity={2} files={"assets/HDR_subdued_blue_nebulae_low.exr"}  />
      {/* Lights and shadows */}
      <SoftShadows size={debugObject.size} samples={debugObject.samples} focus={debugObject.focus} />
      <directionalLight
        ref={directionalLight}
        color={"cyan"}
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
      />

      <directionalLight
        ref={directionalLight}
        color={"cyan"}
        position={debugObject.sunPosition2}
        intensity={1}
        
      />
      
      {/* <ambientLight color={"white"} intensity={3} /> */}
      <hemisphereLight intensity={1} groundColor={0xcc5500} color={"blue"} />
      {/* <mesh castShadow position={[10,10,20]} scale={10}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh> */}
      {/* meshes */}
      <Suspense fallback={null}>
        {/* <BakeShadows /> */} {/* // the shadow lights dont move :) */}
        <Spaceship rotation={[0, Math.PI * 0.5, 0]} position={[0, 0, 0]} fullModule={false} scale={0.1} />
        <Stars position={[0,0,-20]} count={500} radius={2} depth={40} />
        <BackgroundAudio url="audio/521977__geistjon__drone-and-space-sounds-stylophone-gen-x-01_v2.mp3" speed={3} play={phase === "end"} />
      </Suspense>
        <SpaceDistorsion/>
      {phase === "end" && (<>
        <WormHole position={debugObject.wormHolePosition} />
      </>)}

  
    </>
  )
}

export default TheDriving
