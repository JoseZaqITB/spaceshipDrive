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
        <button onClick={() => setLaunch(true)}>Launch</button>
    </div>;
}