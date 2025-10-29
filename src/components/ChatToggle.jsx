"use client";

import { useEffect, useState } from "react";
import ChatBot from "./ChatBot";

export default function ChatToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed sm:bottom-8 bottom-7 sm:right-8 right-5 flex items-end justify-end z-[999]">
      {isClient && (
        <div
          className={`fixed max-w-96 w-full sm:max-h-[700px] max-h-[600px] h-full sm:bottom-28 bottom-24 overflow-hidden border border-b-2 border-black-500 rounded-md shadow-md transition-all duration-300 ease-in-out
  ${
    isOpen
      ? "opacity-100 translate-y-0 pointer-events-auto"
      : "opacity-0 translate-y-2 pointer-events-none"
  }`}
        >
          <ChatBot />
        </div>
      )}
      <button
        onClick={toggleVisibility}
        className="flex sm:h-16 h-12 sm:w-16 w-12 fixed shadow-md rounded-full items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
      >
        <img src="/icon.png" alt="ChatBot" />
      </button>
    </div>
  );
}
