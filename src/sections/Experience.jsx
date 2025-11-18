"use client";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { defaultAnimationName } from "../constants";
import CanvasLoader from "../components/CanvasLoader";
import Developer from "../components/Developer";
import Duration from "@/components/Duration";

const Experience = () => {
  const [animationName, setAnimationName] = useState(defaultAnimationName);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`/api/experience`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch experiences data");
      }

      const data = await response.json();

      setExperiences(data);
    } catch (err) {
      toast.error("Failed to load experiences data.");
    }
  };

  return (
    <section className="c-space my-20" id="work">
      <div className="w-full text-white-600">
        <h3 className="head-text">My Work Experience</h3>

        <div className="work-container">
          <div className="work-canvas">
            <Canvas>
              <ambientLight intensity={7} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <directionalLight position={[10, 10, 10]} intensity={1.5} />
              <OrbitControls
                enableZoom={false}
                enableRotate={false}
                maxPolarAngle={Math.PI / 2}
              />
              <Suspense fallback={<CanvasLoader />}>
                <Developer
                  position-y={-3.5}
                  position-z={-1}
                  rotation={[0.3, 0, 0]}
                  scale={3}
                  animationName={animationName}
                />
              </Suspense>
            </Canvas>
          </div>

          <div className="work-content">
            <div className="sm:py-10 py-5 sm:px-5 px-2.5">
              {experiences.map(
                ({ _id, name, position, image, start, end, description, animation }) => (
                  <div
                    key={_id}
                    className="work-content_container group cursor-pointer"
                    onClick={() => setAnimationName(animation.toLowerCase())}
                    onPointerOver={() =>
                      setAnimationName(animation.toLowerCase())
                    }
                    onPointerOut={() => setAnimationName(defaultAnimationName)}
                  >
                    <div className="flex flex-col h-full justify-start items-center py-2">
                      <div className="work-content_logo">
                        <img src={image} alt="logo" className="w-full h-full" />
                      </div>
                      <div className="work-content_bar" />
                    </div>
                    <div className="sm:p-5 px-2.5 py-5">
                      <p className="font-bold text-white-800">{name}</p>
                      <div className="text-sm flex flex-wrap gap-1 mb-5">
                        <p>{position}</p>
                        <p>|</p>
                        <Duration start={start} end={end} />
                      </div>
                      <p className="group-hover:text-white transition ease-in-out duration-500 whitespace-pre-line">
                        {description}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
