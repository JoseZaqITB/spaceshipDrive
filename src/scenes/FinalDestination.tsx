import Spaceship from "../Spaceship";
import earthVertexShader from "../shaders/earth/vertex.glsl";
import earthFragmentShader from "../shaders/earth/fragment.glsl";
import atmosphereVertexShader from "../shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "../shaders/atmosphere/fragment.glsl";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { BackSide, Color, Mesh, MeshBasicMaterial, ShaderMaterial, SphereGeometry, SRGBColorSpace, Texture, Vector3 } from "three";
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
    const debugObject = useControls("earth",{
        atmosphereColor: "#00aaff",
        nightAtmosphereColor: "#ff6600",
    });
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

    // earth model
    const earth = useRef<Mesh>(null!);

    useFrame((_,delta) => {
        earth.current.rotation.y += 0.01 * delta;
    });

    return <>
        {/* LIGHTS */}
        <directionalLight />
        {/* SHAPES */}
        <mesh ref={sun} position={[-2.7,0,0]} rotation={[0,Math.PI * 0.22, 0]}>
            <circleGeometry args={[0.25]} />
            <meshBasicMaterial alphaMap={txtAlpha} transparent />
        </mesh>

        <mesh ref={earth}>
            <sphereGeometry args={[2, 64, 64]} />
            <earthShaderMaterial ref={earthShader} />
        </mesh>

        <mesh scale={[1.04, 1.04, 1.04]}>
            <sphereGeometry args={[2, 64, 64]} />
            <atmosphereShaderMaterial ref={atmosphereShader} />
        </mesh>

        <Spaceship position={[0,0,10]} rotation-y={Math.PI * 0.5} />

    </>
}