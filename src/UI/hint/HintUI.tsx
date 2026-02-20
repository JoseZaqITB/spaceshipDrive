import { useEffect, useState } from "react";
import styles from "./HintUI.module.css";

export default function HintUI() {
    // show/hide state
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        // call and remove space key listener
        const hide = (key: KeyboardEvent) => { 
            if (key.code === "Space") {
                setShowHint(false);
            };
        }
        // show hint when clicked
        const show = () => { 
                setShowHint(true);
                window.removeEventListener("click", show);
        };
        window.addEventListener("keydown", hide );
        window.addEventListener("click", show );
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