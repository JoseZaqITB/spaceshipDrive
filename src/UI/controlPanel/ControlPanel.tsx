
import useGame from "../../stores/useGame";
import { useKeyboardControls } from "@react-three/drei";
import VelocimeterUI from "../velocimeter/VelocimeterUI";
import styles from "./ControlPanel.module.css";

export default function ControlPanel() {
    const phase = useGame((state) => state.phase);
        const powerUp = useKeyboardControls((state) => state.powerUp);
        const interact = useKeyboardControls((state) => state.interact);
    return (
        <div className={styles.controlPanelContainer}>
            <ControlButton active={interact} enable={phase === "passing"} emoji="𖦹" keyBoard="E" onClick={() => { }} />
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
                backgroundColor: `var(--color-base)`
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