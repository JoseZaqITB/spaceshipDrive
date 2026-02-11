import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type sceneType = "theDriving" | "finalDestination";
type phaseType = "driving" | "passing" | "end";

type GameStoreType = {
    velocity: number,
    timer: number,
    phase: phaseType,
    scene: sceneType,
    setVelocity: (velocity: number ) => void,
    setScene: (scene: sceneType ) => void,
    setPhase: (state: phaseType ) => void,
    setTimer: (state: number ) => void,
}

export default create<GameStoreType>()(subscribeWithSelector((set) => ({
    timer: 0,
    velocity:0,
    phase: "driving",
    scene: "theDriving",
    setVelocity: (velocity) => set({velocity}),
    setScene: (scene) => set({scene}),
    setPhase: (phase) => set(phase === "end" ? {phase, scene: "finalDestination"} : {phase, scene: "theDriving"}),
    setTimer: (timer) => set({timer: timer}),
})))