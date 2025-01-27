import React, { useRef, useState, useEffect } from "react";
import { useFrame, useGraph } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function ClownFishModel(props) {
  const [dirSwitch, setDirSwitch] = useState(false);
  const [radiusFac, setRadiusFac] = useState(0.03); // Increased rotation speed

  const group = useRef();
  const { scene, animations } = useGLTF('/FishOrange.glb');
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  const [pos, setPos] = useState([0, 0, 0]);
  const [rotY, setRotY] = useState(0);

  useEffect(() => {
    setRadiusFac(Math.random() * 0.01 + 0.02); // Faster random rotation speed
    setPos([
      20 * (Math.random() - 0.5),
      props.index * 10 - 5,
      10 * (Math.random() - 0.5),
    ]);
    let angle = Math.random() * 2 * Math.PI;
    setRotY(angle);
  }, []);

  useEffect(() => {
    group.current.rotation.y = rotY;
  }, [rotY]);

  useEffect(() => {
    // Start fish animation (if any)
    actions?.["ArmatureAction.001"]?.reset().play();
  }, [actions]);

  useFrame(() => {
    if (rotY >= 2 * Math.PI || rotY < -2 * Math.PI) {
      setDirSwitch((prev) => !prev);
      setRotY(0);
      return;
    }
    setRotY((prev) => {
      if (dirSwitch) return prev + radiusFac;
      return prev - radiusFac;
    });
    setPos((prev) => {
      return [
        prev[0] + 0.05 * Math.sin(rotY), // Increased movement increment
        prev[1],
        prev[2] + 0.05 * Math.cos(rotY), // Increased movement increment
      ];
    });
  });

  return (
    <group ref={group} {...props} position={pos} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[1.593, 0, 0]} scale={0.2}>
          <primitive object={nodes.Bone} />
          <primitive object={nodes.Bone003} />
          <skinnedMesh
            name="Fish"
            geometry={nodes.Fish.geometry}
            material={materials.Material}
            skeleton={nodes.Fish.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/FishOrange.glb");
