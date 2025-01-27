import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import "./About.css";
import { OrbitControls } from "@react-three/drei";
import ClownFishModel from "../FishClown";
import SeaTurtle from "../SeaTurtle"
import Coral1 from "../Coral1"
import Coral2 from "../Coral2"
import Coral3 from "../Coral3"

import { DoubleSide } from "three";


function Box(props) {
  let boxRef = useRef();

  return (
    <mesh ref={boxRef} position={props.position} scale={props.scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={props.color}
        opacity={props.opacity || 1}
        transparent={props.opacity ? true : false}
        
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Plane(props) {
  let planeRef = useRef();
  useFrame((state, delta) => {
    planeRef.current.rotation.x = 3.141 / 2;
  });

  return (
    <mesh ref={planeRef} position={props.position} scale={props.scale}>
      <planeGeometry args={props.size} recieveShadow />
      <meshStandardMaterial
        color={props.color}
        opacity={props.opacity || 1}
        transparent={props.opacity ? true : false}
        metalness={1}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function SeaTank({ creatureCounts }) {
    const tankSize = 30; // Matches the Box scale
    const halfTankSize = tankSize / 2;
  
    // Extract counts from the hashmap
    const turtleCount = creatureCounts["Turtle"] || 0;
    const fishCount = creatureCounts["Clownfish"] || 0;
    const coral1Count = creatureCounts["Coral1"] || 0;
    const coral2Count = creatureCounts["Coral2"] || 0;
    const coral3Count = creatureCounts["Coral3"] || 0;
    const seagrassCount = creatureCounts["Seagrass"] || 0;
  
    // Generate random positions for corals and seagrass
    const generateRandomPositions = (count, gridSize) => {
      const positions = [];
      for (let i = 0; i < count; i++) {
        const x = (Math.random() * gridSize - gridSize / 2); // Spread over the grid
        const y = (Math.random() * gridSize - gridSize / 2);
        positions.push([x, -tankSize/2 - 1, y]); // Ground level (y = 0)
      }
      return positions;
    };
  
    const coral1Positions = generateRandomPositions(coral1Count, halfTankSize);
    const coral2Positions = generateRandomPositions(coral2Count, halfTankSize);
    const coral3Positions = generateRandomPositions(coral3Count, halfTankSize);
    const seagrassPositions = generateRandomPositions(seagrassCount, halfTankSize);
  
  
    return (
      <div className="main">
        <Canvas camera={{ position: [-25, 50, 50], fov: 75 }}>
          <OrbitControls
            autoRotate
            autoRotateSpeed={1}
            maxDistance={100}
            minDistance={23}
            maxPolarAngle={(4 * Math.PI) / 5}
            minPolarAngle={Math.PI / 5}
          />
          <>
        {/* Point Light */}
        <pointLight
            position={[halfTankSize, halfTankSize, halfTankSize]}
            color={[1, 0.9, 0.7]} 
            intensity={1.5} 
        />
        
        {/* Ambient Light */}
        <ambientLight 
            color={[1, 0.95, 0.8]} 
            intensity={0.5} 
        />

        {/* Directional Light from Above */}
        <directionalLight
            position={[0, tankSize / 2 + 10, 0]} 
            intensity={2.5} 
            color={[1, 0.9, 0.7]} 
            castShadow
        />

        {/* SpotLight for Focused Effect */}
        <spotLight
            position={[0, tankSize / 2 + 15, 0]} // Above the tank, centered
            intensity={3} 
            angle={Math.PI / 6} 
            penumbra={0.5} // Softer edges
            color={[1, 0.85, 0.6]}
            castShadow
        />
        </>

  
          <Suspense>
            {/* Render ClownFishModel */}
            {new Array(fishCount).fill(0).map((_, ind) => {
              const x = Math.random() * tankSize - halfTankSize;
              const y = Math.random() * tankSize - halfTankSize;
              const z = Math.random() * tankSize - halfTankSize;
              return (
                <ClownFishModel
                  scale={2}
                  position={[x, y, z]}
                  index={ind / fishCount}
                  key={`fish-${ind}`}
                />
              );
            })}
  
            {/* Render SeaTurtle */}
            {new Array(turtleCount).fill(0).map((_, ind) => {
              const x = Math.random() * tankSize - halfTankSize;
              const y = Math.random() * tankSize - halfTankSize;
              const z = Math.random() * tankSize - halfTankSize;
              return (
                <SeaTurtle
                  scale={0.3}
                  position={[x, y, z]}
                  index={ind / turtleCount}
                  key={`turtle-${ind}`}
                />
              );
            })}
  
            {/* Render coral objects */}
            {coral1Positions.map((pos, ind) => {
                const adjustedPos = [...pos]; 
                adjustedPos[1] -= 2.2; // Adjust the y-coordinate
                return (
                    <Coral1
                    key={`coral1-${ind}`}
                    scale={[10, 10, 10]}
                    position={adjustedPos}
                    color={[0.8, 0.4, 0.1]}
                    opacity={1}
                    />
                );
            })}

            {coral2Positions.map((pos, ind) => (
              <Coral2
                key={`coral2-${ind}`}
                scale={[10, 10, 10]}
                position={pos}
                color={[0.8, 0.4, 0.1]}
                opacity={1}
              />
            ))}

            {coral3Positions.map((pos, ind) => {
                const adjustedPos = [...pos]; 
                adjustedPos[1] -= 4.2; // Adjust the y-coordinate
                return (
                    <Coral3
                    key={`coral3-${ind}`}
                    scale={[10, 10, 10]}
                    position={adjustedPos}
                    color={[0.8, 0.4, 0.1]}
                    opacity={1}
                    />
                );
            })}
  
            {/* Render seagrass objects */}
            {seagrassPositions.map((pos, ind) => (
              <Box
                key={`seagrass-${ind}`}
                scale={[0.5, 1, 0.5]}
                position={pos}
                color={[0.1, 0.8, 0.1]}
                opacity={1}
              />
            ))}
  

            {/* Render the main cube */}
            <Box
                scale={[tankSize, tankSize, tankSize]}
                position={[0, 0, 0]}
                color={[0, 0.7, 1]}
                opacity={0.2}
            />

            {/* Render the brightened coral reef base */}
            <Box
                scale={[tankSize, 5, tankSize]}
                position={[0, -tankSize / 2 - 2, 0]}
                color={[0.8, 0.6, 0.4]}
                opacity={1}
            />

          </Suspense>
        </Canvas>
      </div>
    );
  }
  
  export default SeaTank;
  