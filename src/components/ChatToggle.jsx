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
    <div className="fixed bottom-0 right-0 flex items-end justify-end z-[999]">
      {isClient && (
        <div
          className={`fixed sm:max-w-96 max-w-80 w-full sm:max-h-[650px] max-h-[600px] h-full right-8 bottom-28 overflow-hidden border border-b-2 border-black-500 rounded-md shadow-md transition-all duration-300 ease-in-out
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
        className="flex h-16 w-16 fixed right-8 bottom-8 shadow-md rounded-full items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
      >
        <img src="/icon.png" alt="ChatBot" />
      </button>
    </div>
  );
}
