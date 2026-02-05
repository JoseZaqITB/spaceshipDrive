import { OrbitControls, Environment, CameraShake } from "@react-three/drei"
import Spaceship from "./Spaceship"
import Stars from "./Stars"
import { Suspense } from "react"


function Experience() {

  return (
    <>
     {/* <CameraShake maxYaw={0.003} maxPitch={0.003} maxRoll={0.003} yawFrequency={5} pitchFrequency={5} rollFrequency={4} /> */}
    <color attach="background" args={['black']} />
    <Environment background environmentIntensity={50} files={"assets/HDR_subdued_blue_nebulae_lower_res.hdr"} />
    <OrbitControls />
    {/* Lights */}
    <ambientLight intensity={0.5} />
    <directionalLight position={[10, 10, 10]} intensity={1} />
    {/* meshes */}
    <Suspense>
      <Spaceship rotation={[0, Math.PI * 0.5, 0]} position={[0,0,3]} />
      <Stars count={10000} radius={10} depth={300} velocity={1} />
    </Suspense>
    {/* Shaders */}

    </>
  )
}

export default Experience
