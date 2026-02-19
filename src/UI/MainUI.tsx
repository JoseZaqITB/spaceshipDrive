import useGame from "../stores/useGame";
import styles from "./MainUI.module.css";
import VelocimeterUI from "./velocimeter/VelocimeterUI";
import LaunchUI from "./launch/LaunchUI";
import HintUI from "./hint/HintUI";

export default function MainUI(){
    // scene status
    const scene = useGame((state) => state.scene);

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