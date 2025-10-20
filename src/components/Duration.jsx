import React from "react";

const Duration = ({ start, end }) => {
  return (
    <p className="text-gray-400 text-sm">
      {start === end
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            year: "numeric",
          }).format(new Date(start))
        : `${new Intl.DateTimeFormat("en-US", {
            month: "short",
            year: "numeric",
          }).format(new Date(start))} - ${new Intl.DateTimeFormat("en-US", {
            month: "short",
            year: "numeric",
          }).format(new Date(end || Date.now()))}`}
    </p>
  );
};

export default Duration;
