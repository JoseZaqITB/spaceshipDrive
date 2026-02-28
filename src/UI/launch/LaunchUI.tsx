import { useEffect, useState } from "react";
import styles from "./launchUI.module.css";
import useGame from "../../stores/useGame";

export default function LaunchUI() {
    
    const [launch, setLaunch] = useState(false);
    const {setScene}  = useGame();

    // load audio
    useEffect(() => {
        const audio = new Audio("audio/625159__erokia__spaceship-launch-shut-off.mp3");
        if(launch){
            audio.volume = 0.5;
            audio.play();  
            // set timer to change scene
            setTimeout(() => { 
                audio.pause();
                audio.currentTime = 0; 
                setScene("theDriving");
            }, 15000);
        } 
            
    },[launch, setScene]);


    return <div className={styles.launchContainer} >
        <button 
            style={launch ? {
                backgroundColor: "var(--color-light)",
                border: "4px solid var(--color-lightest)",
                boxShadow:
                    `0px 0px 120px 8px var(--color-lightest),
                    0px 0px 4px var(--color-lightest),
                    inset 0px 0px 4px var(--color-lightest)`,
                animation: `3s twinkle infinite`,
            }: {}} 
            onClick={() => setLaunch(true)}>Launch</button>
    </div>;
}