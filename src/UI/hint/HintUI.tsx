import { useEffect, useState } from "react";
import styles from "./HintUI.module.css";

export default function HintUI() {
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

    return (
        <div className={styles.hintContainer} style={showHint ? {opacity: 1}: {opacity:0}}>
            <h2>Power Up</h2>
            <div className={styles.hintKeyboard} >
                Space
            </div>
            <p>Press and Hold</p>
        </div>
    );
}