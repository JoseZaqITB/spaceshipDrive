import styles from "./VelocimeterUI.module.css";
import useGame from "../../stores/useGame";
import { globals } from "../../utils";

export default function VelocimeterUI () {

    // global velocity
    const velocity = useGame((state) => state.velocity);

    // split the meter
    const divisions = Array.from({length: 6}, (_, i) => i);
    //
    return <div className={styles.velocimeterContainer} style={globals.isMobile ? {bottom: "10%"} :{} } >
        <div 
            className={styles.indicatorContainer} 
            style={{
                transform: `translate(calc((${velocity / globals.MAXVELOCITY } * 100%) - 5px), 90%)`
            }}  
        >
            <div className={styles.indicator} />
        </div>
        <div className={styles.meter} >
            {divisions.map((value,i) => 
                <div 
                    key={value+i} 
                    className={styles.division}
                    style={{
                        borderWidth: i+1,
                        borderColor: `hsl(${120 - (120/divisions.length)*i},70%, 30%)`, // 120: green, 0: red
                        height: `${(80/divisions.length)*i + 20}%`
                    }}
                />
            )}
        </div>
    </div>
}