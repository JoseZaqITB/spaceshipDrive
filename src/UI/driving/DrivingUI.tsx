import HintUI from "../hint/HintUI";
import VelocimeterUI from "../velocimeter/VelocimeterUI";
import styles from "./DrivingUI.module.css";

import useGame from "../../stores/useGame";
import { useKeyboardControls } from "@react-three/drei";
export default function DrivingUI() {
    const phase = useGame((state) => state.phase);
    const powerUp = useKeyboardControls((state) => state.powerUp);



    return <>
        <ControlPanel phase={phase} powerUp={powerUp} />
        <HintUI />
    </>;
}

function ControlPanel({ phase, powerUp }: { phase: string, powerUp: boolean }) {
    return (
        <div className={styles.controlPanelContainer}>
            <ControlButton enable={phase === "passing"} emoji="𖦹" keyBoard="E" onClick={() => { }} />
            <ControlButton active={powerUp} enable={phase === "driving"} emoji="—͟͟͞͞★" keyBoard="Space" onClick={() => { }} />
            <VelocimeterUIWrapper phase={phase} />
        </div>
    );
}


function ControlButton({ enable, active, emoji, keyBoard, onClick }: { enable: boolean, active?: boolean, emoji: string, keyBoard: string, onClick: () => void }) {
    return (
        <button
            style={active ? {
                boxShadow:
                    `0px 0px 16px 8px var(--color-lightest),
                    0px 0px 4px var(--color-lightest),
                    inset 0px 0px 8px 4px var(--color-lightest)`,
                backgroundColor: `var(--color-light)`
            } : {}}
            className={enable ? styles.controlButton : `${styles.controlButtonDisabled} ${styles.controlButton}`}
            onClick={onClick}
        >
            <div className={styles.emoji} >
                {emoji}
            </div>
            <div className={styles.keyBoard} >
                {keyBoard}
            </div>
        </button>
    );
}


function VelocimeterUIWrapper({ phase }: { phase: string }) {
    return (
        <div className={styles.velocimeterUIWrapper} >
            <VelocimeterUI />
            <div className={phase === "passing" ? styles.wormHole : styles.wormHoleDisabled} >𖦹</div>
        </div>
    );
}
