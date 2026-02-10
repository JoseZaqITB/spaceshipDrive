import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type sceneType = "theDriving" | "finalDestination";
type phaseType = "driving" | "passing" | "end";

type GameStoreType = {
    timer: number,
    phase: phaseType,
    scene: sceneType,
    setScene: (scene: sceneType ) => void,
    setPhase: (state: phaseType ) => void,
    setTimer: (state: number ) => void,
}

export default create<GameStoreType>()(subscribeWithSelector((set) => ({
    timer: 0,
    phase: "driving",
    scene: "theDriving",
    setScene: (scene) => set({scene}),
    setPhase: (phase) => set(phase === "end" ? {phase, scene: "finalDestination"} : {phase, scene: "theDriving"}),
    setTimer: (timer) => set({timer: timer}),
})))