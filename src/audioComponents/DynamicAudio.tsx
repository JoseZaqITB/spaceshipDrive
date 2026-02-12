import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Audio, AudioLoader, AudioListener } from "three";
import useGame from "../stores/useGame";
import { globals } from "../utils";

export default function DynamicAudio({url, volume= 1, loop = false}: {url: string, volume?: number, loop?: boolean}) {
    

    /* SETTING AUDIO */
    const camera = useThree((state) => state.camera);
    const listener = useRef(new AudioListener());
    const buffer = useLoader(AudioLoader, url);
    const sound = useRef<Audio>(null!);

    /* VELOCITY CONFIGURATION */
    const maxSoundDuration = useMemo(() => 134,[]);
    const velocity = useGame((state) => state.velocity);

    const oldVelocity = useRef(0);
    const isIncreasing = useRef(true);

    useFrame(() => {
        // start audio when velocity start increasing
        if(sound.current.isPlaying) {
            // keep audio playing while  velocity is increasing
            if(isIncreasing.current) {
                if(velocity < oldVelocity.current ) {
                    isIncreasing.current = false;
                    console.log("decreasing");
                    sound.current.stop();
                    sound.current.setLoop(false);
                    sound.current.offset = maxSoundDuration - ((velocity * 44) / globals.MAXVELOCITY );
                    console.log(sound.current.loop);
                    sound.current.play();
                }
            } else {
                if(velocity > oldVelocity.current ) {
                    isIncreasing.current = true;
                    console.log("creasing");
                    sound.current.stop();
                    sound.current.offset = 0;
                    sound.current.setLoop(true);
                    sound.current.setLoopStart(20);
                    sound.current.setLoopEnd(90);
                    sound.current.play();
                }
            }
        } else if( velocity > globals.INITIALVELOCITY +  globals.INITIALVELOCITY / 3 ) {
            sound.current.play();
        }
        // set decreasing audio when velocity start decreasing
        
        // update params
        oldVelocity.current = velocity;
        
    });

    useEffect(() => {
        // add to an object
        camera.add(listener.current);

        // set audio
        sound.current = new Audio(listener.current);
        sound.current.setBuffer(buffer);
        sound.current.setVolume(volume);
        sound.current.setLoop(loop);
        /* // start audio
        sound.current.play(); */

        return () => {
            sound.current?.stop();
            camera.remove(listener.current);
        }
    },[buffer, camera, loop, volume]);

    return null;
}