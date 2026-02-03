import { OrbitControls } from "@react-three/drei"


function Experience() {

  return (
    <>
    <OrbitControls />
    <color attach="background" args={['black']} />
      <mesh>
        <boxGeometry args={[1,1,1]} />
        <meshBasicMaterial color="orange" /> 
      </mesh>
    </>
  )
}

export default Experience
