import useGame from "../stores/useGame";
import styles from "./MainUI.module.css";
import VelocimeterUI from "./velocimeter/VelocimeterUI";
import LaunchUI from "./launch/LaunchUI";
import HintUI from "./hint/HintUI";
import {useState } from "react";
import { globals } from "../utils";

export default function MainUI(){
    // active UI
    const [transition, setTransition] = useState(false);
    useGame.subscribe((state) => state.scene ,() => {
        setTransition(true)
        const timer = setTimeout(() => {
            setTransition(false);
        },globals.transitionDelay * 1000);
        return () => {
            clearTimeout(timer);
        }
    });
    
    // scene status
    const scene = useGame((state) => state.scene);
    if(transition) return <div className={styles.transition} />;
    return <div className={styles.UIContainer} >
        {scene === "theDriving" && 
        <>
            <VelocimeterUI />
            <HintUI />
        </>
        }
        {scene === "launch" && <LaunchUI />}
        
    </div>;
    
}