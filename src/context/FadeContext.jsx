"use client";
import { createContext, useContext, useState } from "react";

const FadeContext = createContext(null);

export const FadeProvider = ({ children }) => {
  const [isFading, setIsFading] = useState(false);
  const [isInSystem, setIsInSystem] = useState(false);

  return (
    <FadeContext.Provider
      value={{ isFading, setIsFading, isInSystem, setIsInSystem }}
    >
      {children}
    </FadeContext.Provider>
  );
};

export const useFade = () => {
  const context = useContext(FadeContext);
  if (!context) {
    throw new Error("useFade must be used within a FadeProvider");
  }
  return context;
};
