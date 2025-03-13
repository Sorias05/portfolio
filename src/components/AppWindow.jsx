"use client";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { X, Maximize, Minimize } from "lucide-react";

const AppWindow = ({ title, children, onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowState, setWindowState] = useState({
    width: 600,
    height: 400,
    x: 100,
    y: 100,
  });

  const handleMaximize = () => {
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
      dragHandleClassName="drag-handle"
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
      className={`absolute black border flex flex-col min-w-[550px] min-h-[700px] justify-between items-baseline border-gray-700 shadow-lg text-white 
    ${!isMaximized && "rounded-lg"} z-50 overflow-hidden`}
    >
      <div className="flex w-full h-8 items-center justify-between black absolute px-2 py-1 cursor-default drag-handle z-50">
        <span
          onDoubleClick={handleMaximize}
          className="w-full h-full text-sm flex items-center"
        >
          {title}
        </span>
        <div className="flex space-x-2">
          <button
            className="hover:bg-gray-700 p-1 rounded"
            onClick={handleMaximize}
          >
            {isMaximized ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button className="hover:bg-gray-700 p-1 rounded" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="select-none pt-8 w-full h-full absolute">{children}</div>
    </Rnd>
  );
};

export default AppWindow;
