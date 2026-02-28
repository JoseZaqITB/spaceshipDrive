
import useGame from "../../stores/useGame";
import VelocimeterUI from "../velocimeter/VelocimeterUI";
import styles from "./ControlPanel.module.css";

export default function ControlPanel() {
    const phase = useGame((state) => state.phase);
    const buttons = useGame((state) => state.buttons);
    const {interact, powerUp} = buttons;
    
    const setButtons = useGame((state) => state.setButtons);


    return (
        <div className={styles.controlPanelContainer}>
            <ControlButton 
                active={interact} 
                enable={phase === "passing"} 
                emoji="𖦹" 
                keyBoard="E" 
                onClick={() => setButtons({interact: true, powerUp: false})} 
                onLeave={() => setButtons({interact: false, powerUp: false})} />
            <ControlButton 
                active={powerUp} 
                enable={phase === "driving"} 
                emoji="⚡︎" 
                keyBoard="Space" 
                onClick={() => setButtons({interact: false, powerUp: true})}
                onLeave={() => setButtons({interact: false, powerUp: false})} />
            <VelocimeterUIWrapper phase={phase} />  
        </div>
    );
}


function ControlButton({ enable, active, emoji, keyBoard, onClick =  () => {}, onLeave = () => {} }: { enable: boolean, active?: boolean, emoji: string, keyBoard: string, onClick?: () => void, onLeave?: () => void }) {
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
            onPointerDown={onClick}
            onPointerUp={onLeave}
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