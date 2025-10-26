"use client";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import gsap from "gsap";

const Arrow = ({ position, rotation }) => {
  const arrowRef = useRef();
  const { nodes, materials } = useGLTF("/models/arrow.glb");

  useGSAP(() => {
    gsap.to(arrowRef.current.position, {
      y: arrowRef.current.position.y + 0.5,
      duration: 2,
      repeat: -1,
      yoyo: true,
    });
  });

  return (
    <group dispose={null}>
      <group rotation={rotation} position={position}>
        <group scale={1}>
          <mesh
            ref={arrowRef}
            castShadow
            receiveShadow
            geometry={nodes.Object_5.geometry}
            material={
              new THREE.MeshBasicMaterial({
                color: "#FFD700",
              })
            }
            scale={0.001}
          />
        </group>
      </group>
    </group>
  );
};

useGLTF.preload("/arrow.glb");

export default Arrow;
