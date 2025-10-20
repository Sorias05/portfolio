"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Project from "@/components/admin/Project";
import ProjectForm from "@/components/admin/ProjectForm";

const Page = () => {
  const [projects, setProjects] = useState([]);
  const [addProject, setAddProject] = useState(false);

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
    <div className="my-4 space-y-4">
      <h3 className="grid-headtext text-center w-full">Projects</h3>
      {projects.length > 0 &&
        projects.map((project) => (
          <Project
            key={project._id}
            project={project}
            fetchProjects={() => fetchProjects()}
          />
        ))}
      {addProject ? (
        <ProjectForm
          close={() => setAddProject(false)}
          fetchProjects={() => fetchProjects()}
        />
      ) : (
        <button
          onClick={() => setAddProject(true)}
          className="field-btn w-full"
        >
          Add
        </button>
      )}
    </div>
  );
};

export default Page;
