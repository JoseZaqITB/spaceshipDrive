import Spaceship from "../Spaceship";
import earthVertexShader from "../shaders/earth/vertex.glsl";
import earthFragmentShader from "../shaders/earth/fragment.glsl";
import atmosphereVertexShader from "../shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "../shaders/atmosphere/fragment.glsl";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { BackSide, Color, Group, Mesh, MeshBasicMaterial, ShaderMaterial, SphereGeometry, SRGBColorSpace, Texture, Vector3 } from "three";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useControls } from "leva";

// shaders
const EarthShaderMaterial = shaderMaterial(
    {
        uTDay: new Texture(),
        uTNight: new Texture(),
        uTEClouds: new Texture(),
        uSunPosition: new Vector3(0, 1.8369701987210297e-16, 3),
        uAtmosphereDayColor: new Color("#ffffff"),
        uAtmosphereNightColor: new Color("#000000"),
    },
    earthVertexShader,
    earthFragmentShader,
);

const AtmosphereShaderMaterial = shaderMaterial(
    {
        uSunPosition: [-5,0,5],
        uAtmosphereDayColor: new Color("#ffffff"),
        uAtmosphereNightColor: new Color("#000000"),
    },
    atmosphereVertexShader,
    atmosphereFragmentShader,
    (material)=> {
        material!.transparent = true;
        material!.side = BackSide;
    }
);

extend({EarthShaderMaterial,AtmosphereShaderMaterial});

// MAIN
export default function FinalDestination() {
    /* debug */
    const [debugObject, setDebugObject] = useControls(() => ({
        atmosphereColor: "#00aaff",
        nightAtmosphereColor: "#ff6600",
        earthRadius: 2,
        sunPosition:  [ 2 ,0,-0.2],
    }));
    /** Camera */
    const camera = useThree((state) => state.camera);
    /**
     * Sun
     */
    const sun = useRef<Mesh<SphereGeometry, MeshBasicMaterial>>(null!);
    const txtAlpha = useTexture("assets/imgs/alpha.jpg", (txt) => {
        txt.colorSpace = SRGBColorSpace;
    });

    /* SHADERS */
    const earthShader = useRef<ShaderMaterial>(null!);
    const atmosphereShader = useRef<ShaderMaterial>(null!);

    // textures
    const tEarthDay = useTexture("assets/earth/day.jpg", (txt) => {
        txt.colorSpace = SRGBColorSpace;
        txt.anisotropy = 4;
    });
    const tEarthNight = useTexture("assets/earth/night.jpg", (txt) => {
        txt.colorSpace = SRGBColorSpace;
        txt.anisotropy = 4;
    });
    const tEarthClouds = useTexture("assets/earth/specularClouds.jpg", (txt) => {
        txt.colorSpace = SRGBColorSpace;
        txt.anisotropy = 4;
    });

    useEffect(() => {
        // camera settings
        camera.position.set(1,1,4);
        // sun config
        setDebugObject({sunPosition: [(debugObject.earthRadius + 0.4),0,0] });

        // shaders
        earthShader.current.uniforms.uTDay.value = tEarthDay;
        earthShader.current.uniforms.uTNight.value = tEarthNight;
        earthShader.current.uniforms.uTEClouds.value = tEarthClouds;
        earthShader.current.uniforms.uSunPosition.value = sun.current.position;
        earthShader.current.uniforms.uAtmosphereDayColor.value = new Color(debugObject.atmosphereColor);
        earthShader.current.uniforms.uAtmosphereNightColor.value = new Color(debugObject.nightAtmosphereColor);

        atmosphereShader.current.uniforms.uSunPosition.value = sun.current.position;
        atmosphereShader.current.uniforms.uAtmosphereDayColor.value = new Color(debugObject.atmosphereColor);
        atmosphereShader.current.uniforms.uAtmosphereNightColor.value = new Color(debugObject.nightAtmosphereColor);
    }, []);

    // model animations
    const earth = useRef<Mesh>(null!);
    const spaceship = useRef<Group>(null!);
    const target = new Vector3(0.4, 0.6,debugObject.earthRadius + 0.1); // dont let me use useMemo
    // animations
    useFrame((_,delta) => {
        // earth rotation
        earth.current.rotation.y += 0.01 * delta;

        // spaceship movement
        spaceship.current.position.lerp(target, 1 - Math.exp(-0.1 *  delta));
    });

    return <>
        {/* LIGHTS */}
        <directionalLight position={debugObject.sunPosition} />
        {/* SHAPES */}
        <mesh ref={sun} position={debugObject.sunPosition} rotation={[0,Math.PI * 0.0, 0]}>
            <circleGeometry args={[0.25]} />
            <meshBasicMaterial alphaMap={txtAlpha} transparent />
        </mesh>

        <mesh ref={earth}>
            <sphereGeometry args={[debugObject.earthRadius, 64, 64]} />
            <earthShaderMaterial ref={earthShader} />
        </mesh>

        <mesh scale={[1.04, 1.04, 1.04]}>
            <sphereGeometry args={[debugObject.earthRadius, 64, 64]} />
            <atmosphereShaderMaterial ref={atmosphereShader} />
        </mesh>

        <Spaceship ref={spaceship} position={[0.6,1.0,4.1]} rotation-y={Math.PI * 0.5} scale={0.01} />

    </>
}