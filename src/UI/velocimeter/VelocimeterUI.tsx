import styles from "./VelocimeterUI.module.css";
import useGame from "../../stores/useGame";
import { globals } from "../../utils";

export default function VelocimeterUI () {

    // global velocity
    const velocity = useGame((state) => state.velocity);

    // split the meter
    const divisions = Array.from({length: 6}, (_, i) => i);
    //
    return <div className={styles.velocimeterContainer}  >
        <div className={styles.meter} >
            {divisions.map((value,i) => 
                <div 
                    key={value+i} 
                    className={styles.division}
                    style={{
                        backgroundColor: `hsl(240, ${Math.min(30, 10 + (velocity / globals.MAXVELOCITY) * 20 * ( divisions.length / (i+1) ))}%, ${Math.min(30 + (velocity / globals.MAXVELOCITY) * 60 * ( divisions.length / (i+1) ))}%)`,
                        height: `${(80/divisions.length)*i + 20}%`
                    }}
                />
            )}
        </div>
    </div>
}