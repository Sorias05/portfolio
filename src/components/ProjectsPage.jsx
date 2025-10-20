"use client";

import { useEffect, useState } from "react";
import Duration from "./Duration";
import Tag from "./Tag";

const ProjectsPage = ({ setActiveProject, setUrl }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/project`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects data");
      }

      const data = await response.json();

      setProjects(data);
    } catch (err) {
      toast.error("Failed to load projects data.");
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-6 pb-20 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Projects</h1>

      <div className="my-6 space-y-4">
        {projects &&
          projects.map((project) => (
            <div
              key={project._id}
              className={`bg-gray-800 p-4 rounded-lg ${
                project.clickable &&
                "hover:bg-gray-700 transition-all cursor-pointer"
              }`}
              onClick={() => {
                if (project.clickable) {
                  setActiveProject(project._id);
                  setUrl(project.url);
                }
              }}
            >
              <div className="flex justify-between items-center gap-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {project.title}
                </h2>
                <Duration start={project.start} end={project.end} />
              </div>
              <p className="text-gray-300 mt-2 whitespace-pre-line">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag) => (
                  <Tag
                    key={tag._id}
                    img={tag.image}
                    text={tag.title}
                    color={tag.color}
                    isDark={tag.isDark}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
