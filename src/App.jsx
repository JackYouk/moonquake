import { Canvas, useFrame } from "@react-three/fiber"
import { Butterfly } from "./Butterfly"
import { Environment, Lightformer, OrbitControls, Float, ContactShadows, Text3D, Center, } from "@react-three/drei"
import * as THREE from 'three'
import { LayerMaterial, Base, Depth, Noise } from 'lamina'
import { useRef } from "react"
import Moon from "./Moon"

function App() {

  return (
    <>
      <Canvas camera={{ position: [0, 0, window.innerWidth < 700 ? 7 : 5] }} style={{position: 'absolute', width: '100%', height: '100dvh'}}>
        <OrbitControls />
        <pointLight position={[10, 10, 5]} />
        <pointLight position={[-10, -10, -5]} />
        <ambientLight intensity={0.4} />


        {/* <Butterflies /> */}

        <Moon scale={2} position={[0, 1, 0]} />

        <group position={[0, 0, 0]}>
          <Float 
            position={[0, -2.5, 0]} 
            speed={1} 
            rotationIntensity={1} 
            floatIntensity={1}
          >
            <Center>
              <Text3D scale={0.3} font={'./Mplus1_Code_Regular.json'} castShadow receiveShadow>
                {`Moon Quake Example\nBy JackJack`}
                <meshStandardMaterial color="white" roughness={0.1} metalness={0.5} />
              </Text3D>
            </Center>
          </Float>
          {/* <ContactShadows scale={10} blur={3} opacity={0.25} far={10} /> */}
        </group>


        <Environment background resolution={64}>
          <mesh scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <LayerMaterial side={THREE.BackSide}>
              <Base color="black" alpha={1} mode="normal" />
              <Depth colorA="#301934" colorB="#050A30" alpha={0.5} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
              <Noise mapping="local" type="cell" scale={0.5} mode="softlight" />
            </LayerMaterial>
          </mesh>
        </Environment>



      </Canvas>
    </>
  );
}

export default App;
