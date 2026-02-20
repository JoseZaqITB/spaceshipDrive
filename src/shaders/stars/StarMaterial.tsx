import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import { shaderMaterial } from "@react-three/drei";
import { AdditiveBlending } from "three";


export type StarMaterialInstance = InstanceType<typeof StarMaterial>

export const StarMaterial = shaderMaterial(
    {
        uTime: 0,
        uPosition: 10,
        uDepth: 100,
    },
    vertexShader,
    fragmentShader,
    (material) => {
        if (material) {
            material.depthWrite = false;
            material.blending = AdditiveBlending;
        }
    }
);
