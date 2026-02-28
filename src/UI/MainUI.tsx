import useGame from "../stores/useGame";
import styles from "./MainUI.module.css";
import LaunchUI from "./launch/LaunchUI";
import {useState } from "react";
import { globals } from "../utils";
import DrivingUI from "./driving/DrivingUI";

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
        {scene === "theDriving" && <DrivingUI />}
        {scene === "launch" && <LaunchUI />}
    </div>;
    
}