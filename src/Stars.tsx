
import { Point, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import useGame from "./stores/useGame";
import { globals } from "./utils";
import { StarMaterial, type StarMaterialInstance } from "./shaders/stars/StarMaterial";

export default function Stars({ position=[0,0,0], count = 1000, radius = 5, depth = 20, maxSize = 4}) {
    const starMaterial = useRef<StarMaterialInstance>(null!);

    // random star positions
    const [points] = useState(() => {
        return Array.from({length: count}, () => {
            const randomDirection = (Math.random() > 0.5 ? 1 : -1);
            return {
                position: [randomDirection * radius + randomDirection * Math.random() * depth,
                    (Math.random() - 0.5) * 2 * depth,
                    (-0.7 + Math.random()) * depth // 0.7 -> get more on the negative values than positive values]
                ] as [number, number, number],
                size: (Math.random() + 1) / 2 * maxSize
            };
        })
    });
    // powerUp feature
    const velocity = useGame((state) => state.velocity);
    const accPosition = useRef(0);
    useEffect(() => {
        if (starMaterial.current) {
            starMaterial.current.uDepth = depth;
        }
    }, [depth])

    useFrame((_,delta) => {
        if (starMaterial.current) {
            accPosition.current += Math.pow(velocity/ globals.MAXVELOCITY, 3) * delta *  globals.MAXVELOCITY * 10;
            starMaterial.current.uPosition = accPosition.current;
        }
    })

    return <Points position={new Vector3(position[0], position[1], position[2])} limit={count}>
        <primitive
            object={new StarMaterial()}
            attach="material"
            ref={starMaterial}
        />
        {points.map((point, i) => {
            return <Point key={i}
                position={point.position}
                color="white"
                size={point.size}
            />
        })}
    </Points>
}