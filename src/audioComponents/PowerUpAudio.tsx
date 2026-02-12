import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Audio, AudioLoader, AudioListener } from "three";
import useGame from "../stores/useGame";
import { globals } from "../utils";

export default function PowerUpAudio({url, volume= 1, loop = false}: {url: string, volume?: number, loop?: boolean}) {
    

    /* SETTING AUDIO */
    const camera = useThree((state) => state.camera);
    const listener = useRef(new AudioListener());
    const buffer = useLoader(AudioLoader, url);
    const sound = useRef<Audio>(null!);

    /* VELOCITY CONFIGURATION */
    const maxSoundDuration = useMemo(() => 134,[]);
    const velocity = useGame((state) => state.velocity);

    const oldVelocity = useRef(globals.INITIALVELOCITY + 0.1);
    const isIncreasing = useRef(false);

    useFrame((_, delta) => {
        // start audio when velocity start increasing
            // keep audio playing while  velocity is increasing
            if(isIncreasing.current) {
                if(velocity < oldVelocity.current ) {
                    isIncreasing.current = false;
                    sound.current.stop();
                    sound.current.setLoop(false);
                    sound.current.offset = maxSoundDuration - ((velocity * 44) / globals.MAXVELOCITY );
                    console.log(sound.current.loop);
                    //
                    const t = delta * Math.log(1- 0.9) / Math.log(1- (globals.DEFAULT_ACCELERATION * delta));
                    const speed = 44 / t;
                    console.log("t: ", t, "speed: ",speed);

                    sound.current.setPlaybackRate(speed);
                    //
                    sound.current.play();
                }
            } else {
                if(velocity > oldVelocity.current ) {
                    // set decreasing audio when velocity start decreasing
                    isIncreasing.current = true;
                    sound.current.stop();
                    sound.current.offset = 0;
                    sound.current.setLoop(true);
                    sound.current.setLoopStart(20);
                    sound.current.setLoopEnd(90);
                    //
                    const t = delta * Math.log(1- 0.9) / Math.log(1- (globals.DEFAULT_ACCELERATION * delta));
                    const speed = 90 / t;
                    console.log("delta: ", delta, "t: ", t, "speed: ",speed);

                    sound.current.setPlaybackRate(speed);
                    //
                    sound.current.play();
                }
            }
        
        
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