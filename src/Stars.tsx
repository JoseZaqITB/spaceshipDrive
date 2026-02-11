
import { Point, Points, shaderMaterial } from "@react-three/drei";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AdditiveBlending, Mesh, Vector3 } from "three";
import { globals } from "./utils";
import useGame from "./stores/useGame";

const StarMaterial = shaderMaterial(
    {
        uTime: 0,
        uVelocity: 10,
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

extend({ StarMaterial })

export default function Stars({ position=[0,0,0], count = 1000, radius = 5, depth = 20, maxSize = 4, velocity: initialVelocity = 10, acceleration = globals.DEFAULT_ACCELERATION }) {
    const starMaterial = useRef<Mesh>(null!);

    // powerUp feature
    const velocity = useGame((state) => state.velocity);
    useEffect(() => {
        if (starMaterial.current) {
            starMaterial.current.uDepth = depth;
        }
    }, [depth])

    useFrame((state, delta) => {
        if (starMaterial.current) {
            starMaterial.current.uTime = state.clock.getElapsedTime();
        }
        starMaterial.current.uVelocity = velocity;
    })

    return <Points position={new Vector3(position[0], position[1], position[2])} limit={count}>
        <starMaterial ref={starMaterial} />
        {Array.from({ length: count }).map((_, i) => {
            const randomDirection = (Math.random() > 0.5 ? 1 : -1);
            return <Point key={i}
                position={[
                    randomDirection * radius + randomDirection * Math.random() * depth,
                    (Math.random() - 0.5) * 2 * depth,
                    (-0.7 + Math.random()) * depth // 0.7 -> get more on the negative values than positive values
                ]}
                color="white"
                size={(Math.random() + 1) / 2 * maxSize}
            />
        })}
    </Points>
}