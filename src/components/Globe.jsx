"use client";
import { Suspense, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, OrbitControls } from "@react-three/drei";
import CanvasLoader from "./CanvasLoader";

const Globe = () => {
  const globeRef = useRef();
  const lightRef = useRef();
  const [globeTexture, bumpTexture] = useTexture([
    "/assets/earth-night.jpg",
    "/assets/earth-topology.png",
  ]);
  const { camera } = useThree();

  useFrame(() => {
    if (globeRef.current) globeRef.current.rotation.y += 0.002;

    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
      lightRef.current.position.y += 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[1, 1, 1]} intensity={0.5} />
      <directionalLight ref={lightRef} intensity={2.5} />
      <Suspense fallback={<CanvasLoader />}>
        <mesh ref={globeRef}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial
            map={globeTexture}
            bumpMap={bumpTexture}
            roughness={0.65}
          />
        </mesh>
      </Suspense>
      <OrbitControls enableZoom={false} />
    </>
  );
};

export default Globe;
