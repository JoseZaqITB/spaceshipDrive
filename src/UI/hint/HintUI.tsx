import { useEffect, useState } from "react";
import styles from "./HintUI.module.css";
import { globals } from "../../utils";

export default function HintUI() {
    // show/hide state
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        // mobile support
        const mobileHide = () => {
            setShowHint(false);
            window.removeEventListener("pointerdown", mobileHide);
        }
        // call and remove space key listener
        const hide = (key: KeyboardEvent) => { 
            if (key.code === "Space") {
                setShowHint(false);
            };
        }
        // show hint when clicked
        const show = () => { 
                setShowHint(true);
                window.removeEventListener("pointerdown", show);
                // mobile support
                window.addEventListener("pointerdown", mobileHide);
        };
        window.addEventListener("keydown", hide );
        window.addEventListener("pointerdown", show );
        return () => window.removeEventListener("keydown", hide);
    }, []);

    return (
        <div className={styles.hintContainer} style={showHint ? {opacity: 1}: {opacity:0}}>
            <h2>Power Up</h2>
            <div className={globals.isMobile ?  styles.hintTouch : styles.hintKeyboard} >
                {!globals.isMobile && "Space"}
            </div>
            <p>{globals.isMobile ? "Touch and Hold" : "Press and Hold"}</p>
        </div>
    );
}