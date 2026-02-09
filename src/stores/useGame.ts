import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type sceneType = "drive" | "end";
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
    scene: "drive",
    setScene: (scene) => set({scene}),
    setPhase: (state) => set({phase: state}),
    setTimer: (state) => set({timer: state}),
})))