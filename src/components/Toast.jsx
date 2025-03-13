"use client";
import { useFade } from "@/context/FadeContext";
import React from "react";
import { ToastBar, Toaster } from "react-hot-toast";

const Toast = () => {
  const { isInSystem } = useFade();
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 5000,
            style: {
              background: "green",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "green",
            },
          },
          duration: 5000,
          error: {
            style: {
              background: "red",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "red",
            },
          },
        }}
        containerClassName={`${
          isInSystem ? "react-hot-toast-system" : "react-hot-toast-container"
        }`}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              animation: t.visible
                ? "custom-enter 0.2s ease-out"
                : "custom-exit 0.2s ease-in forwards",
            }}
          />
        )}
      </Toaster>
    </>
  );
};

export default Toast;
