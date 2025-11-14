import { useState } from "react";
import toast from "react-hot-toast";
import Tag from "../Tag";
import ProjectForm from "./ProjectForm";
import DeletionModal from "../DeletionModal";
import Duration from "../Duration";

const Project = ({ project, fetchProjects }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/project/${project._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProjects();
        toast.success("Project removed successfully");
      } else {
        toast.error("Failed to remove project");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return editMode ? (
    <ProjectForm
      close={() => setEditMode(false)}
      initialData={project}
      fetchProjects={fetchProjects}
    />
  ) : (
    <div key={project._id} className="bg-gray-800 p-4 rounded-lg text-white">
      <div className="flex justify-between items-start">
        <div className="flex gap-2 items-end">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {project.title}
          </h2>
          <Duration start={project.start} end={project.end} />
        </div>
        <div className="flex gap-2 items-center min-w-16">
          <button className="acc" onClick={() => setEditMode(true)}>
            <img src="/assets/edit-btn.png" alt="edit" className="w-5 h-5" />
          </button>
          <button className="error" onClick={() => setShowDeleteConfirm(true)}>
            <img
              src="/assets/remove-btn.png"
              alt="remove"
              className="w-5 h-5"
            />
          </button>
        </div>
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
      {showDeleteConfirm && (
        <DeletionModal
          text={"Are you sure you want to remove this project?"}
          setShowDeleteConfirm={setShowDeleteConfirm}
          confirm={deleteProject}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Project;
