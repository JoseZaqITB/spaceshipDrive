import styles from "./FadedUI.module.css";

import { useEffect, useState } from "react";
export default function FadedUI({children}: {children: React.ReactNode}) {
    
    // click to show UI
    const [show, setShow] = useState(false);
    useEffect(()=> {
        const onPress = () => {
            setShow(true);
            window.removeEventListener("click", onPress);
        };
        window.addEventListener("click", onPress);
    }, []);

    return <div className={styles.FadedUI} style={show ? {opacity: 1}: {opacity:0}}>
        {children}
    </div>;
}
