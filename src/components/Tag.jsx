import { noImage2 } from "@/constants";
import React from "react";

const Tag = ({ img, text, color, isDark }) => {
  return (
    <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 border border-gray-400 ${isDark ? "text-white" : "text-black"}`} style={{ backgroundColor: color }}>
      <img src={img || noImage2} alt={text} className="w-4 h-4" />
      <p>{text}</p>
    </span>
  );
};

export default Tag;
