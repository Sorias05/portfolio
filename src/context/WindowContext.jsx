"use client";

import { createContext, useContext, useState, useCallback } from "react";

const WindowManagerContext = createContext();

export const WindowManagerProvider = ({ children }) => {
  const [windowOrder, setWindowOrder] = useState([]);

  const bringToFront = useCallback((title) => {
    setWindowOrder((prevOrder) => [
      ...prevOrder.filter((item) => item !== title),
      title,
    ]);
  }, []);

  const getZIndex = useCallback(
    (title) => windowOrder.indexOf(title) + 10,
    [windowOrder]
  );

  return (
    <WindowManagerContext.Provider value={{ bringToFront, getZIndex }}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => useContext(WindowManagerContext);
