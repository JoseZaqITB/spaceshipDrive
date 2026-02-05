 
import { Point, Points, shaderMaterial } from "@react-three/drei";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AdditiveBlending } from "three";

const StarMaterial = shaderMaterial(
    {
        uTime: 0,
        uVelocity: 10,
        uDepth: 100,
    },
    vertexShader,
    fragmentShader,
    (material) => {
        if(material){
            material.depthWrite = false;
            material.blending = AdditiveBlending;
        }
    }
);

extend({ StarMaterial })

export default function Stars({ count = 1000, radius = 5, depth = 20, maxSize = 4, velocity = 10 }) {
    const starMaterial = useRef(null);

    useEffect(() => {
        if(starMaterial.current) {
            starMaterial.current.uDepth = depth;
            starMaterial.current.uVelocity = velocity;
        }
    },[depth, velocity])

    useFrame((state) => {
        if (starMaterial.current) {
            starMaterial.current.uTime = state.clock.getElapsedTime();
        }

    })

    return <Points limit={count}>
        <starMaterial ref={starMaterial} />
        {Array.from({ length: count }).map((_, i) => {
            const randomDirection = (Math.random() > 0.5 ? 1 : -1);
            return <Point key={i}
                position={[
                    randomDirection * radius + randomDirection * Math.random() * depth,
                    (Math.random() - 0.5) * 2 * depth,
                    (-0.7 + Math.random() )  * depth // 0.7 -> get more on the negative values than positive values
                ]}
                color="white"
                size={(Math.random() + 1) / 2 * maxSize}
            />
        })}
    </Points>
}