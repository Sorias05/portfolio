"use client";
import React, { useEffect, useState } from "react";
import { Chrome, File, Power } from "lucide-react";
import { useFade } from "@/context/FadeContext";
import { useWindowManager } from "@/context/WindowContext";
import Clock from "@/components/Clock";
import AppWindow from "@/components/AppWindow";
import Browser from "@/components/Browser";
import Resume from "@/components/Resume";

const System = () => {
  const { setIsFading, setIsInSystem } = useFade();
  const { bringToFront } = useWindowManager();
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWindowOverSidebar, setIsWindowOverSidebar] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [apps, setApps] = useState([
    {
      id: 1,
      title: "Projects",
      isOpen: false,
      isOverSidebar: false,
      getIcon: (size) => {
        return <Chrome size={size} />;
      },
      getApp: () => {
        return <Browser />;
      },
    },
    {
      id: 2,
      title: "Resume",
      isOpen: false,
      isOverSidebar: false,
      getIcon: (size) => {
        return <File size={size} />;
      },
      getApp: () => {
        return <Resume />;
      },
    },
  ]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  useEffect(() => {
    const isOverSidebar = apps.some(
      ({ isOpen, isOverSidebar }) => isOpen && isOverSidebar
    );

    setIsWindowOverSidebar((prev) => {
      if (prev === isOverSidebar) return prev;
      return isOverSidebar;
    });

    setIsSidebarHidden((prev) => {
      if (prev === isOverSidebar) return prev;
      return isOverSidebar;
    });
  }, [apps]);

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

  const handleMouseMove = (e) => {
    if (e.clientX <= 12) {
      setIsSidebarHidden(false);
    } else if (isWindowOverSidebar && e.clientX > 56) {
      setIsSidebarHidden(true);
    }
  };

  return (
    <main className="w-screen h-[100dvh]" onMouseMove={handleMouseMove}>
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

        <div
          className={`absolute z-50 left-0 top-8 bottom-0 w-14 bg-gray-900 bg-opacity-50 flex flex-col items-center p-2 space-y-4 transition-transform duration-500 ${
            isSidebarHidden ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          {apps.map(({ id, title, isOpen, getIcon }) => (
            <button
              key={id}
              className={`text-white hover:bg-gray-700 p-2 rounded ${
                isOpen && "bg-gray-700 bg-opacity-50"
              }`}
              onClick={() => {
                setApps((prevApps) =>
                  prevApps.map((app) =>
                    app.title === title ? { ...app, isOpen: true } : app
                  )
                );
                bringToFront(title);
              }}
            >
              {getIcon(24)}
            </button>
          ))}
        </div>

        <div className="flex justify-end absolute left-0 top-8 bottom-0 right-0">
          {apps.map(
            ({ id, title, isOpen, getApp }) =>
              isOpen && (
                <AppWindow
                  key={id}
                  title={title}
                  onClose={() => {
                    setApps((prevApps) =>
                      prevApps.map((app) =>
                        app.id === id ? { ...app, isOpen: false } : app
                      )
                    );
                  }}
                  setIsWindowOverSidebar={(isOver) => {
                    setApps((prevApps) =>
                      prevApps.map((app) =>
                        app.id === id ? { ...app, isOverSidebar: isOver } : app
                      )
                    );
                  }}
                >
                  {getApp()}
                </AppWindow>
              )
          )}
          <div className="flex-grow flex flex-col absolute p-3">
            {apps.map(({ id, title, getIcon }) => (
              <button
                key={id}
                className="p-4 rounded-lg text-white flex flex-col items-center hover:bg-gray-600 hover:bg-opacity-50"
                onDoubleClick={() => {
                  setApps((prevApps) =>
                    prevApps.map((app) =>
                      app.title === title ? { ...app, isOpen: true } : app
                    )
                  );
                  bringToFront(title);
                }}
              >
                {getIcon(40)}
                <span className="mt-2">{title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default System;
