import Experience from "./Experience"
import FinalDestination from "./FinalDestination";
import useGame from "./stores/useGame"

export default function SceneManager() {
    const scene = useGame((state) => state.scene);
    if(scene === "finalDestination") {
        return <FinalDestination />
    } else if(scene=== "theDriving") {
        return <Experience />
    }
}