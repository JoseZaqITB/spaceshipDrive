import TheDriving from "./TheDriving"
import FinalDestination from "./FinalDestination";
import useGame from "./stores/useGame"
import { Perf } from "r3f-perf";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import FadedTransition from "./FadedTransition";

export default function SceneManager() {
    const scene = useGame((state) => state.scene); 
    const [transition, setTransition] = useState(true);

    // listen to scene changes
    useGame.subscribe((state) => state.scene ,() => {setTransition(true)});
    

    return <>
        <Perf position="top-left" />
        <OrbitControls />
        {scene === "finalDestination" ? <FinalDestination /> : <TheDriving />}
        {transition && <FadedTransition delay={4} setTransition={setTransition} />}
    </>;
}