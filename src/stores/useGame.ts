import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { globals } from "../utils";

type sceneType = "theDriving" | "finalDestination" | "launch";
type phaseType = "driving" | "passing" | "end";

type ButtonsType = {
    interact: boolean,
    powerUp: boolean,
}

type GameStoreType = {
    buttons: ButtonsType,
    velocity: number,
    phase: phaseType,
    scene: sceneType,
    setVelocity: (velocity: number ) => void,
    setScene: (scene: sceneType ) => void,
    setPhase: (state: phaseType ) => void,
    setButtons: (state: ButtonsType ) => void,
}

export default create<GameStoreType>()(subscribeWithSelector((set) => ({
    buttons: {
        interact: false,
        powerUp: false,
    },
    velocity: globals.INITIALVELOCITY,
    phase: "driving",
    scene: "launch",
    setVelocity: (velocity) => set({velocity}),
    setScene: (scene) => set({scene}),
    setPhase: (phase) => set({phase}),
    setButtons: (buttons) => set({buttons}),
})))