/* eslint-disable react-hooks/purity */
import { Point, Points, shaderMaterial } from "@react-three/drei";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const StarMaterial = shaderMaterial(
    {
        uTime: 0,
        uVelocity: 10,
        uDepth: 100,
    },
    vertexShader,
    fragmentShader
);

extend({ StarMaterial })

export default function Stars({ count = 1000, radius = 5, depth = 20 }) {
    const starMaterial = useRef(null);

    useEffect(() => {
        if(starMaterial.current) {
            starMaterial.current.uDepth = depth;
        }
    },[depth])

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
                size={0.5}
            />
        })}
    </Points>
}