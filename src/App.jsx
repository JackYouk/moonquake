import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, Float, Text3D, Center, Stars, CameraShake, } from "@react-three/drei"
import * as THREE from 'three'
import { LayerMaterial, Base, Depth, Noise } from 'lamina'
import { useRef, useState, useEffect } from "react"
import Moon from "./Moon"

function App() {

  return (
    <>
      {/* 3D-Canvas */}
      <Canvas camera={{ position: [0, 0, window.innerWidth < 700 ? 7 : 5] }} style={{ position: 'absolute', width: '100%', height: '100dvh' }}>
        
        {/* Camera Controls (right click to move, left click to rotate, scroll to zoom) */}
        {/* <OrbitControls /> */}
        <CameraShake />
        
        {/* Staging/Lights */}
        <pointLight position={[10, 10, 5]} />
        <pointLight position={[-10, -10, -5]} />
        <ambientLight intensity={0.4} />

        {/* Moon Model */}
        <Moon scale={2} position={[0, 1, 0]} />

        {/* Floating Text */}
        <group position={[0, 0, 0]}>
          <Float
            position={[0, -2, 0]}
            speed={1}
            rotationIntensity={1}
            floatIntensity={1}
          >
            <Center>
              <Text3D scale={0.3} font={'./Mplus1_Code_Regular.json'} castShadow receiveShadow>
                {`Moon Quake Example`}
                <meshStandardMaterial color="white" roughness={0.1} metalness={0.5} />
              </Text3D>
              <Text3D scale={0.2} position={[0, -0.5, 0]} font={'./Mplus1_Code_Regular.json'} castShadow receiveShadow>
                {`Click the moon to start/increase quake.\nDouble click to reset.`}
                <meshStandardMaterial color="white" roughness={0.1} metalness={0.5} />
              </Text3D>
              <Text3D scale={0.15} position={[0, -1.3, 0]} font={'./Mplus1_Code_Regular.json'} castShadow receiveShadow>
                {`Made by JackJack`}
                <meshStandardMaterial color="white" roughness={0.1} metalness={0.5} />
              </Text3D>
            </Center>
          </Float>
        </group>

        {/* Stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Background (black with hints of darkpurple/darkblue) */}
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
