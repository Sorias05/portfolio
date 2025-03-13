import React, { useState, useEffect } from "react";

export const Clock = () => {
  var [date, setDate] = useState(new Date());

  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <p className="text-sm py-1 px-2">
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </p>
  );
};

export default Clock;
