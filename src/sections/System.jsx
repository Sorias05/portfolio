"use client";
import React, { useEffect, useState } from "react";
import { Chrome, Folder, Power } from "lucide-react";
import Browser from "@/components/Browser";
import { useFade } from "@/context/FadeContext";
import Clock from "@/components/Clock";
import AppWindow from "@/components/AppWindow";

const System = () => {
  const { setIsFading, setIsInSystem } = useFade();
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const handleShutdownClick = () => {
    setIsShuttingDown(true);
    setTimeout(() => {
      setIsLoading(true);
    }, 100);
    setTimeout(() => {
      setIsFading(true);
    }, 2000);
    setTimeout(() => {
      setIsInSystem(false);
    }, 3000);
    setTimeout(() => {
      setIsFading(false);
    }, 3500);
  };

  return (
    <main className="w-screen h-screen">
      <div
        className={`w-full h-full black flex flex-col gap-24 items-center justify-center absolute text-white transition-opacity duration-500 ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      >
        <img src="/assets/ubuntu.svg" alt="Ubuntu" className="w-64 h-64" />
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="mt-4 animate-spin border-4 border-white border-t-transparent rounded-full w-8 h-8"></div>
          {isShuttingDown && <p>Shutting Down</p>}
        </div>
        <img src="/assets/ubuntu2.png" alt="Ubuntu" className="w-60" />
      </div>
      <section
        className={`w-full h-full bg-system from-red-900 to-gray-900 flex flex-col absolute overflow-hidden transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute top-0 left-0 w-full black text-white flex items-center justify-between text-sm h-8">
          <div className="py-1 px-3">Activities</div>
          <Clock />
          <button
            className="text-white hover:bg-red-600 p-1 mx-2 rounded-full"
            onClick={handleShutdownClick}
          >
            <Power size={16} />
          </button>
        </div>

        <div className="absolute left-0 top-8 bottom-0 w-14 bg-gray-900 bg-opacity-50 flex flex-col items-center p-2 space-y-4">
          <button
            className={`text-white hover:bg-gray-700 p-2 rounded ${
              isBrowserOpen && "bg-gray-800"
            }`}
            onClick={() => setIsBrowserOpen(!isBrowserOpen)}
          >
            <Chrome size={24} />
          </button>
          {/* <button className="text-white hover:bg-gray-700 p-2 rounded">
            <Folder size={24} />
          </button> */}
        </div>

        <div className="flex justify-end absolute left-14 top-8 bottom-0 right-0">
          {isBrowserOpen && (
            <AppWindow title="Projects" onClose={() => setIsBrowserOpen(false)}>
              <Browser />
            </AppWindow>
          )}
          <div className="flex-grow flex absolute p-3">
            <button
              className="p-4 rounded-lg text-white flex flex-col items-center hover:bg-gray-600 hover:bg-opacity-50 selection:bg-green-600 selection:bg-opacity-50"
              onDoubleClick={() => setIsBrowserOpen(true)}
            >
              <Chrome size={40} />
              <span className="mt-2">Projects</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default System;
