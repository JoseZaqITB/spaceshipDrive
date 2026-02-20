import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { shaderMaterial } from "@react-three/drei";

export type WormHoleInstance = InstanceType<typeof WormHoleShaderMaterial>

export const WormHoleShaderMaterial = shaderMaterial(
    {uTime:0},
    vertexShader,
    fragmentShader,
    (material) => {
            if (material) {
                material.transparent = true;
            }
        }
);