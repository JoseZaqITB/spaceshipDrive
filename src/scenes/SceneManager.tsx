import TheDriving from "./TheDriving"
import FinalDestination from "./FinalDestination";
import useGame from "../stores/useGame"
/* import { Perf } from "r3f-perf"; */
import { useState } from "react";
import { globals } from "../utils";

export default function SceneManager() {
    const scene = useGame((state) => state.scene); 
    const [transition, setTransition] = useState(false);

    // listen to scene changes
    useGame.subscribe((state) => state.scene ,() => {
            setTransition(true)
            const timer = setTimeout(() => {
                setTransition(false);
            },globals.transitionDelay * 1000 -500);
            return () => {
                clearTimeout(timer);
            }
        });
    
    if(transition) return null;
    return <>
        {/* <Perf position="top-left" /> */}
        {scene === "finalDestination" && <FinalDestination />} 
        {scene === "theDriving" &&  <TheDriving />}
    </>;
}