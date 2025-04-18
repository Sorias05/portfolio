"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { calculateSizes, developer } from "../constants";
import CanvasLoader from "../components/CanvasLoader";
import HackerRoom from "../components/HackerRoom";
import Target from "../components/Target";
import ReactLogo from "../components/ReactLogo";
import Cube from "../components/Cube";
import Rings from "../components/Rings";
import HeroCamera from "../components/HeroCamera";
import Button from "../components/Button";
import { useFade } from "@/context/FadeContext";

const Hero = () => {
  const isSmall = useMediaQuery({ maxWidth: 440 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

  const sizes = calculateSizes(isSmall, isMobile, isTablet);

  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsFading, setIsInSystem } = useFade();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleMonitorClick = () => {
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      setIsZoomed(true);
      setIsFading(true);
    }, 100);
    setTimeout(() => {
      setIsInSystem(true);
      setIsZoomed(false);
      setIsFading(false);
    }, 1000);
  };

  return (
    <section
      className={`min-h-screen w-full flex flex-col relative transition-all duration-1000 ${
        isZoomed ? "scale-120" : "scale-100"
      }`}
      id="projects"
    >
      <div className="w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3">
        <p className="sm:text-3xl text-2xl font-medium text-white text-center font-generalsans">
          Hi, I am {developer} <span className="waving-hand">👋</span>
        </p>
        <p className="hero_tag text-gray_gradient">Building Web Applications</p>
      </div>

      <div
        className={`w-full h-full fixed inset-0 transition-opacity duration-1000 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Canvas className="w-full h-full">
          <Suspense fallback={<CanvasLoader />} />
          <PerspectiveCamera makeDefault position={[0, 0, 25]} />
          <HeroCamera isMobile={isMobile} isZoomed={isZoomed}>
            <HackerRoom
              scale={sizes.deskScale}
              position={sizes.deskPosition}
              rotation={[0, -Math.PI, 0]}
              onMonitorClick={handleMonitorClick}
            />
          </HeroCamera>
          <group>
            <Target position={sizes.targetPosition} />
            <ReactLogo position={sizes.reactLogoPosition} />
            <Cube position={sizes.cubePosition} />
            <Rings position={sizes.ringPosition} />
          </group>
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={0.5} />
        </Canvas>
      </div>

      <div className="absolute bottom-7 left-0 right-0 w-full z-10 c-space">
        <a href="/#about" className="w-fit">
          <Button
            name="Let's work together!"
            isBeam
            containerClass="sm:w-fit w-full sm:min-w-96"
          />
        </a>
      </div>
    </section>
  );
};

export default Hero;
