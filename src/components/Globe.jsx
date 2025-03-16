"use client";
import { Suspense, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, OrbitControls, shaderMaterial } from "@react-three/drei";
import CanvasLoader from "./CanvasLoader";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

const AtmosphereMaterial = shaderMaterial(
  {
    glowColor: new THREE.Color(0x91c6ff),
  },
  `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  varying vec3 vNormal;
  uniform vec3 glowColor;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
    gl_FragColor = vec4(glowColor, 0.2) * intensity;
  }
  `
);

extend({ AtmosphereMaterial });

const Globe = () => {
  const globeRef = useRef();
  const lightRef = useRef();
  const { camera } = useThree();
  const [globeTexture, bumpTexture] = useTexture([
    "/assets/earth-night.jpg",
    "/assets/earth-topology.png",
  ]);

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

        <mesh scale={1.2}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <atmosphereMaterial side={THREE.BackSide} depthWrite={false} />
        </mesh>
      </Suspense>

      <OrbitControls enableZoom={false} />
    </>
  );
};

export default Globe;
