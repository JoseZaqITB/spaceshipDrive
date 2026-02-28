import Spaceship from "../Spaceship";
import { AtmosphereShaderMaterial } from "../shaders/atmosphere/Atmosphere";
import { EarthShaderMaterial } from "../shaders/earth/earthMaterial";
import { Environment, PositionalAudio, useKeyboardControls, useTexture } from "@react-three/drei";
import { Color, Group, HalfFloatType, Mesh, ShaderMaterial, SRGBColorSpace, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Leva, useControls } from "leva";
import BackgroundAudio from "../audioComponents/BackgroundAudio";
import { Bloom, EffectComposer, ShockWave, ToneMapping } from "@react-three/postprocessing";
import { ShockWaveEffect, ToneMappingMode } from "postprocessing";
import useGame from "../stores/useGame";

// shaders




// MAIN
export default function FinalDestination() {
    /* debug */
    const [debugObject, setDebugObject] = useControls(() => ({
        atmosphereColor: "#00aaff",
        nightAtmosphereColor: "#ff6600",
        earthRadius: 2,
        sunPosition:  [ 2 ,-1,-1],
        BloomIntensity: 0.5, // The bloom intensity.
        BloomLuminanceThreshold: 0.25, // luminance threshold. Raise this value to mask out darker elements in the scene.
        BloomLuminanceSmoothing: 0.025, // smoothness of the luminance threshold. Range is [0, 1]
        earthRotation: {value:-Math.PI * 0.5, min: -Math.PI, max: Math.PI, step: 0.01},
    }));
    /** Camera */
    const {camera, pointer} = useThree();
    

    /* SHADERS */
    const earthShader = useRef<ShaderMaterial>(null!);
    const atmosphereShader = useRef<ShaderMaterial>(null!);

    // textures
    const tEarthDay = useTexture("assets/makemake/2k_makemake_fictional.jpg", (txt) => {
        txt.colorSpace = SRGBColorSpace;
        txt.anisotropy = 4;
    });
    const tEarthClouds = useTexture("assets/earth/specularClouds.jpg", (txt) => {
        txt.colorSpace = SRGBColorSpace;
        txt.anisotropy = 4;
    });

    /* PHASES */
    const setPhase = useGame((state) => state.setPhase);
    const phase = useGame((state) => state.phase);
    // mouse movement
    const [isMouseActive, setIsMouseActive] = useState(false);
    const [initialCameraPos] = useState(new Vector3(1,1,4));
    /** CONTROLS */
    const [showSpaceship, setShowSpaceship] = useState(false);

    const [subscribeKeys] = useKeyboardControls( );
    subscribeKeys((state) => state.interact, () => {
        if(!showSpaceship) {
            setShowSpaceship(true) 
            setPhase("end");
        }
        });
    // shockwave
      const shockWaveEffect = useRef<ShockWaveEffect>(null!);  
      useEffect(()=> {if(showSpaceship) shockWaveEffect.current.explode(); },[showSpaceship]);
    //
    useEffect(() => {
        // set initial phase
        setPhase("passing");
        // camera settings
        camera.position.set(1,1,4);
        camera.lookAt(0,0,0);
        // sun config
        setDebugObject({sunPosition: [(debugObject.earthRadius + 0.4),0,0] });

        // shaders
        earthShader.current.uniforms.uTDay.value = tEarthDay;
        earthShader.current.uniforms.uTEClouds.value = tEarthClouds;
        earthShader.current.uniforms.uSunPosition.value = [(debugObject.earthRadius + 0.4),0,0];
        earthShader.current.uniforms.uAtmosphereDayColor.value = new Color(debugObject.atmosphereColor);
        earthShader.current.uniforms.uAtmosphereNightColor.value = new Color(debugObject.nightAtmosphereColor);

        atmosphereShader.current.uniforms.uSunPosition.value = [(debugObject.earthRadius + 0.4),0,0];
        atmosphereShader.current.uniforms.uAtmosphereDayColor.value = new Color(debugObject.atmosphereColor);
        atmosphereShader.current.uniforms.uAtmosphereNightColor.value = new Color(debugObject.nightAtmosphereColor);
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
    }, []);

    // model animations
    const earth = useRef<Mesh>(null!);
    const spaceship = useRef<Group>(null!);
    const target = new Vector3(0.4, 0.6,debugObject.earthRadius + 0.1); // dont let me use useMemo
    // animations
    useFrame((_,delta) => {
        /* mouse movement */
        if(isMouseActive){
        camera.position.lerp({x:pointer.x * 0.1 + initialCameraPos.x , y:pointer.y * 0.1 + initialCameraPos.y,z:camera.position.z}, 0.01);
        }
        // earth rotation
        earth.current.rotation.y += 0.01 * delta;

        if(showSpaceship){
    
            // spaceship movement
            spaceship.current.position.lerp(target, 1 - Math.exp(-0.1 *  delta));
        }
    });

    return <>
        <Leva hidden />
        {/* EFFECTS */}
        <EffectComposer multisampling={ 4 } frameBufferType={HalfFloatType} >
            <ShockWave 
                ref={shockWaveEffect}
                position={[0.6,1.0,3.8]}
                size={0.01}
                extent={0.1}
                speed={0.05}         
                waveSize={0.1}      
                amplitude={0.005}    
            />

            {/** COLOR EFFECTS */}
            <Bloom 
                mipmapBlur 
                intensity={debugObject.BloomIntensity} // The bloom intensity.
                luminanceThreshold={debugObject.BloomLuminanceThreshold} // luminance threshold. Raise this value to mask out darker elements in the scene.
                luminanceSmoothing={debugObject.BloomLuminanceSmoothing} // smoothness of the luminance threshold. Range is [0, 1]
            />
            
            {/* Default */}
            <ToneMapping mode={ ToneMappingMode.LINEAR } exposure={1.0} />
        </EffectComposer>
        {/* AUDIO */}
        <BackgroundAudio url={"audio/214663__hykenfreak__deep-space-ship-effect_v3.mp3"} play volume={0.5} />
        <BackgroundAudio url="audio/521977__geistjon__drone-and-space-sounds-stylophone-gen-x-01_v2.mp3" speed={3} play={phase === "end"} loop={false}/>
        
        {/* BACKGROUND */}
        <Environment 
            background 
            environmentIntensity={2} 
            backgroundRotation={[Math.PI * 0.5, 0,0]} 
            environmentRotation={[Math.PI * 0.5, 0,0]}
            files={"assets/HDR_subdued_blue_nebulae_low.exr"} 
        />
        {/* LIGHTS */}
        <directionalLight position={debugObject.sunPosition} intensity={10} />
        {/* SHAPES */}

        <mesh ref={earth}>
            <sphereGeometry args={[debugObject.earthRadius, 64, 64]} />
            <primitive  object={new EarthShaderMaterial()} attach={"material"} ref={earthShader} />
        </mesh>

        <mesh scale={[1.04, 1.04, 1.04]}>
            <sphereGeometry args={[debugObject.earthRadius, 64, 64]} />
            <primitive  object={new AtmosphereShaderMaterial()} attach={"material"} ref={atmosphereShader} />
        </mesh>
        
        <Spaceship ref={spaceship} position={[0.6,1.0,5.1]} rotation-y={Math.PI * 0.5} scale={0.01}>
            <PositionalAudio url={"audio/427504__solarphasing__industrial-noises-ambient-sound-1_v2.mp3"} loop autoplay distance={0.5} setVolume={3} />
        </Spaceship>
        

    </>
}