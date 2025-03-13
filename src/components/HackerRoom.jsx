"use client";
import { useCursor, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Select } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const HackerRoom = (props) => {
  const { nodes, materials } = useGLTF("/models/hacker-room.glb");
  const monitorRef = useRef(null);

  const monitortxt = useTexture("/textures/desk/monitor.png");
  const screenTxt = useTexture("/textures/desk/screen.png");

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(({ clock }) => {
    if (monitorRef.current && monitorRef.current.material) {
      const glowStrength = 1.5 + Math.sin(clock.elapsedTime * 2) * 0.5;
      if (monitorRef.current.material.emissiveIntensity !== glowStrength) {
        monitorRef.current.material.emissiveIntensity = hovered
          ? glowStrength
          : 1;
      }
    }
  });

  const handleClickMonitor = () => {
    props.onMonitorClick();
  };

  return (
    <>
      <group {...props} dispose={null}>
        <mesh
          geometry={nodes.screen_screens_0.geometry}
          material={materials.screens}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleClickMonitor}
        >
          <meshMatcapMaterial map={screenTxt} />
        </mesh>
        <mesh
          geometry={nodes.screen_glass_glass_0.geometry}
          material={materials.glass}
        />
        <mesh
          geometry={nodes.table_table_mat_0_1.geometry}
          material={materials.table_mat}
        />
        <Select enabled>
          <mesh
            ref={monitorRef}
            geometry={nodes.table_table_mat_0_2.geometry}
            material={materials.computer_mat}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={handleClickMonitor}
          >
            {hovered ? (
              <meshStandardMaterial emissive={"white"} emissiveIntensity={0} />
            ) : (
              <meshStandardMaterial map={monitortxt} />
            )}
          </mesh>
        </Select>
        <mesh
          geometry={nodes.table_table_mat_0_3.geometry}
          material={materials.server_mat}
        />
        <mesh
          geometry={nodes.table_table_mat_0_4.geometry}
          material={materials.vhsPlayer_mat}
        />
        <mesh
          geometry={nodes.table_table_mat_0_5.geometry}
          material={materials.stand_mat}
        />
        <mesh
          geometry={nodes.table_table_mat_0_6.geometry}
          material={materials.mat_mat}
        />
        <mesh
          geometry={nodes.table_table_mat_0_7.geometry}
          material={materials.arm_mat}
        />
        <mesh
          geometry={nodes.table_table_mat_0_8.geometry}
          material={materials.tv_mat}
        >
          <meshMatcapMaterial map={monitortxt} />
        </mesh>
        <mesh
          geometry={nodes.table_table_mat_0_9.geometry}
          material={materials.cables_mat}
        />
        <mesh
          geometry={nodes.table_table_mat_0_10.geometry}
          material={materials.props_mat}
        />
        <mesh
          geometry={nodes.table_table_mat_0_11.geometry}
          material={materials.ground_mat}
        />
        <mesh
          geometry={nodes.table_table_mat_0_12.geometry}
          material={materials.key_mat}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleClickMonitor}
        />
        <EffectComposer>
          <Bloom
            intensity={hovered ? 0.5 : 0}
            radius={0.01}
            luminanceFilter={true}
            luminanceThreshold={1}
            luminanceSmoothing={0.5}
          />
        </EffectComposer>
      </group>
    </>
  );
};

useGLTF.preload("/models/hacker-room.glb");

export default HackerRoom;
