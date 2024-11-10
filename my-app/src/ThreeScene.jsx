import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function SpinningBox() {
  const boxRef = useRef();

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.01;
      boxRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={boxRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="tomato" />
    </mesh>
  );
}

function ThreeScene() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <SpinningBox />
    </Canvas>
  );
}

export default ThreeScene;