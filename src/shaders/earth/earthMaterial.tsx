import earthVertexShader from "./vertex.glsl";
import earthFragmentShader from "./fragment.glsl";
import { shaderMaterial } from "@react-three/drei";
import { Color, Texture, Vector3 } from "three";

export const EarthShaderMaterial = shaderMaterial(
    {
        uTDay: new Texture(),
        uTEClouds: new Texture(),
        uSunPosition: new Vector3(0, 1.8369701987210297e-16, 3),
        uAtmosphereDayColor: new Color("#ffffff"),
        uAtmosphereNightColor: new Color("#000000"),
    },
    earthVertexShader,
    earthFragmentShader,
);