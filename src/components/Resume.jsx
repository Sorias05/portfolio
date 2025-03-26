"use client";

import { resume } from "@/constants";

const Resume = () => {
  return (
    <div className="w-full h-full overflow-auto">
      <iframe
        src={resume}
        className="w-full h-full"
        title="Oleksandr Shrol CV"
      />
    </div>
  );
};

export default Resume;
