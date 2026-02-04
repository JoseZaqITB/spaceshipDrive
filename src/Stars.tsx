/* eslint-disable react-hooks/purity */
import { Point, Points } from "@react-three/drei";

export default function Stars({count = 1000, radius = 5, depth = 20}) {
   
    return <Points limit={count}>
        <pointsMaterial color="white" size={0.5} sizeAttenuation={true}  />
        {Array.from({length:count}).map((_,i) => {
            const randomDirection = (Math.random() > 0.5 ? 1 : -1);
            return <Point key={i}
                position={[
                    randomDirection * radius  + randomDirection * Math.random() * depth,
                    (Math.random() - 0.5) * 2 * depth,
                    (Math.random() - 0.5) * 2 * depth
                ]} 
                color="white" 
                size={0.5} 
            />
        })}
    </Points>
}