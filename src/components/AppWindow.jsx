"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Rnd } from "react-rnd";
import { X, Maximize, Minimize } from "lucide-react";

const AppWindow = ({ title, children, onClose, setIsSidebarHidden }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowState, setWindowState] = useState({
    width: 1000,
    height: 700,
    x: 100,
    y: 0,
  });

  const updateWindowBounds = useCallback(() => {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    setWindowState((prev) => ({
      width: Math.min(prev.width, maxWidth),
      height: Math.min(prev.height, maxHeight),
      x: Math.max(0, Math.min(prev.x, maxWidth - prev.width)),
      y: Math.max(0, Math.min(prev.y, maxHeight - prev.height)),
    }));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateWindowBounds);
    updateWindowBounds();
    return () => window.removeEventListener("resize", updateWindowBounds);
  }, [updateWindowBounds]);

  useEffect(() => {
    if (isMaximized || windowState.x < 56) {
      setIsSidebarHidden(true);
    } else {
      setIsSidebarHidden(false);
    }
  }, [isMaximized, windowState, setIsSidebarHidden]);

  const handleMaximize = () => {
    if (isMaximized) {
      updateWindowBounds();
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <Rnd
      size={{
        width: isMaximized ? "100%" : windowState.width,
        height: isMaximized ? "100%" : windowState.height,
      }}
      position={{
        x: isMaximized ? 0 : windowState.x,
        y: isMaximized ? 0 : windowState.y,
      }}
      bounds="parent"
      enableResizing={!isMaximized}
      dragAxis="both"
      dragHandleClassName="drag-title"
      onDrag={(e, d) => {
        setWindowState((prev) => ({
          ...prev,
          x: d.x,
          y: d.y,
        }));
      }}
      onResize={(e, direction, ref, delta, position) => {
        setWindowState({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        });
      }}
      className={`absolute black border flex flex-col min-w-[350px] min-h-[350px] justify-between items-baseline border-gray-700 shadow-lg text-white 
      ${!isMaximized && "rounded-lg"} z-40 overflow-hidden`}
    >
      <div className="flex w-full h-8 items-center black absolute px-2 py-1 cursor-default z-40">
        <span
          onDoubleClick={handleMaximize}
          className="drag-title w-full h-full text-sm flex items-center"
        >
          {title}
        </span>
        <div className="flex space-x-2">
          <button
            className="hover:bg-gray-700 p-1 rounded z-50"
            onClick={handleMaximize}
          >
            {isMaximized ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button
            className="hover:bg-gray-700 p-1 rounded z-50"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="select-none pt-8 w-full h-full absolute">{children}</div>
    </Rnd>
  );
};

export default AppWindow;
