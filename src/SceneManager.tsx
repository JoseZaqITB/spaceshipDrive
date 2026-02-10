import TheDriving from "./TheDriving"
import FinalDestination from "./FinalDestination";
import useGame from "./stores/useGame"
import { Perf } from "r3f-perf";
import FadedTransition from "./FadedTransition";
import { OrbitControls } from "@react-three/drei";

export default function SceneManager() {
    const scene = useGame((state) => state.scene); 


    return <>
        <Perf position="top-left" />
        <OrbitControls />
        {scene === "finalDestination" ? <FinalDestination /> : <TheDriving />}
    </>;
}