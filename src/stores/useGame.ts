import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type sceneType = "theDriving" | "finalDestination" | "launch";
type phaseType = "driving" | "passing" | "end";

type GameStoreType = {
    velocity: number,
    phase: phaseType,
    scene: sceneType,
    setVelocity: (velocity: number ) => void,
    setScene: (scene: sceneType ) => void,
    setPhase: (state: phaseType ) => void,
}

export default create<GameStoreType>()(subscribeWithSelector((set) => ({
    velocity:0,
    phase: "driving",
    scene: "launch",
    setVelocity: (velocity) => set({velocity}),
    setScene: (scene) => set({scene}),
    setPhase: (phase) => set({phase}),
})))