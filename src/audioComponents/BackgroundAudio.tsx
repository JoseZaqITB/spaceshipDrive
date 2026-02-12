import { useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Audio, AudioLoader, AudioListener } from "three";

export default function BackgroundAudio({url = "audio/214663__hykenfreak__deep-space-ship-effect_v3.mp3", volume= 1, loop = true, speed=1}: {url?: string, volume?: number, loop?: boolean, speed?: number}) {
    const camera = useThree((state) => state.camera);
    const listener = useRef(new AudioListener());
    const buffer = useLoader(AudioLoader, url);
    const sound = useRef<Audio>(null!);

    useEffect(() => {
        // add to an object
        camera.add(listener.current);

        // set audio
        sound.current = new Audio(listener.current);
        sound.current.setBuffer(buffer);
        sound.current.setVolume(volume);
        sound.current.setLoop(loop);
        sound.current.setPlaybackRate(speed);
        // start audio
        sound.current.play();

        return () => {
            sound.current?.stop();
            camera.remove(listener.current);
        }
    },[buffer, camera, loop, volume]);

    return null;
}