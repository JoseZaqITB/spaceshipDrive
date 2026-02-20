import atmosphereVertexShader from "./vertex.glsl";
import atmosphereFragmentShader from "./fragment.glsl";
import { shaderMaterial } from "@react-three/drei";
import { BackSide, Color } from "three";

export const AtmosphereShaderMaterial = shaderMaterial(
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