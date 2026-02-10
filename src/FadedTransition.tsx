import { useFrame, useThree } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react";
import type { Mesh } from "three";

export default function FadedTransition({delay = 1, fadeDuration = 1}: {delay?: number, fadeDuration?: number}) {
    // faded feature
    const plane = useRef<Mesh>(null!);
    const timer = useRef(0);
    useFrame((_,delta) => {
        if(timer.current >= delay)
            plane.current.material.opacity -= Math.max(1/fadeDuration * delta, 0);
        // update timer
        timer.current += delta;
    } );

    // start position 
    const camera = useThree((state) => state.camera);
    useLayoutEffect(() => {
        plane.current.position.copy(camera.position);
        plane.current.rotation.copy(camera.rotation);

        plane.current.position.x -= 0.1;
        plane.current.position.y -= 0.1;
        plane.current.position.z -= 0.1;
    }, []);

    return <mesh ref={plane}>
        <planeGeometry args={[1,1,1,1]}  />
        <meshBasicMaterial color={"cyan"} opacity={1} transparent />
    </mesh>
}