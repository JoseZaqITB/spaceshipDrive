import { useGLTF, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { AudioLoader } from "three";

export default function preload() {
    /* LAUNCH SCENE */
    useLoader.preload(AudioLoader, "audio/625159__erokia__spaceship-launch-shut-off.mp3");
    /* THE DRIVING SCENE */
    // audio
    useLoader.preload(AudioLoader, "audio/214663__hykenfreak__deep-space-ship-effect_v3.mp3");
    useLoader.preload(AudioLoader, "public/audio/427504__solarphasing__industrial-noises-ambient-sound-1_v2.mp3");
    useLoader.preload(AudioLoader, "audio/47631__jovica__space-sweep-11_v2.mp3");
    useLoader.preload(AudioLoader, "audio/521977__geistjon__drone-and-space-sounds-stylophone-gen-x-01_v2.mp3");

    // hdri
    useTexture.preload("assets/HDR_subdued_blue_nebulae_lower_res.hdr");

    // models
    useGLTF.preload("/models/spaceship_V2.glb");

    /* FINAL DESTINATION SCENE */
    // textures
    useTexture.preload("assets/imgs/alpha.jpg");
    useTexture.preload("assets/earth/day.jpg");
    useTexture.preload("assets/earth/night.jpg");
    useTexture.preload("assets/earth/specularClouds.jpg");

}