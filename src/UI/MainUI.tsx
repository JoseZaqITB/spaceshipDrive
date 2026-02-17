import useGame from "../stores/useGame";
import styles from "./MainUI.module.css";
import { useEffect, useState } from "react";
import VelocimeterUI from "./velocimeter/VelocimeterUI";

export default function MainUI(){
    // scene status
    const scene = useGame((state) => state.scene);
    // show/hide state
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        // call and remove space key listener
        const hide = (key: KeyboardEvent) => { 
            if (key.code === "Space") {
                setShowHint(false);
            };
        }
        window.addEventListener("keydown", hide );
        return () => window.removeEventListener("keydown", hide);
    }, []);

    
        return <div className={styles.UIContainer} >
            {scene === "theDriving" && <VelocimeterUI />}
            <div className={styles.hintContainer} style={showHint ? {opacity: 1}: {opacity:0}}>
                <h2>Power Up</h2>
                <div className={styles.hintKeyboard} >
                    Space
                </div>
                <p>Press and Hold</p>
            </div>
        </div>;
    
}