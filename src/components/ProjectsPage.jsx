"use client";

import { projects } from "@/constants";
import Tag from "./Tag";

const ProjectsPage = ({ setActiveProject, setUrl }) => {
  return (
    <div className="w-full h-full bg-gray-900 text-white p-6 pb-20 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Projects</h1>

      <div className="my-6 space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`bg-gray-800 p-4 rounded-lg ${project.clickable && "hover:bg-gray-700 transition-all cursor-pointer"}`}
            onClick={() => {
              if (project.clickable) {
                setActiveProject(project.id);
                setUrl(project.url);
              }
            }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {project.title}
              </h2>
              <p className="text-gray-400 text-sm">{project.duration}</p>
            </div>
            <p className="text-gray-300 mt-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.map((tag) => (
                <Tag
                  key={tag.id}
                  img={tag.img}
                  text={tag.text}
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
