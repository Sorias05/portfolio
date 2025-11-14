"use client";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { defaultAnimationName } from "../constants";

const Developer = ({ animationName = defaultAnimationName, ...props }) => {
  const group = useRef();
  const { nodes, materials } = useGLTF("/models/human/developer.glb");

  const idle = useFBX("/models/human/idle.fbx");
  const salute = useFBX("/models/human/salute.fbx");
  const clapping = useFBX("/models/human/clapping.fbx");
  const victory = useFBX("/models/human/victory.fbx");

  const animations = useMemo(() => {
    idle.animations[0].name = "idle";
    salute.animations[0].name = "salute";
    clapping.animations[0].name = "clapping";
    victory.animations[0].name = "victory";

    return [
      idle.animations[0],
      salute.animations[0],
      clapping.animations[0],
      victory.animations[0],
    ];
  }, [idle, salute, clapping, victory]);

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions[animationName]?.reset().fadeIn(0.5).play();
    return () => actions[animationName]?.fadeOut(0.5);
  }, [animationName]);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  );
};

useGLTF.preload("/models/human/developer.glb");

export default Developer;
