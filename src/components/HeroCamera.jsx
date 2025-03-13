"use client";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";

const HeroCamera = ({ children, isMobile, isZoomed }) => {
  const groupRef = useRef();
  const targetPosition = isZoomed ? [-0.2, 1.7, 5] : [0, 0, 25];

  useFrame((state, delta) => {
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    if (!isMobile && !isZoomed) {
      easing.dampE(
        groupRef.current.rotation,
        [-state.pointer.y / 3, state.pointer.x / 5, 0],
        0.25,
        delta
      );
      easing.dampE(groupRef.current.rotation, [0, 0, 0], 0.25, delta);
    }
  });

  return (
    <group ref={groupRef} scale={isMobile ? 1 : 1.4}>
      {children}
    </group>
  );
};

export default HeroCamera;
