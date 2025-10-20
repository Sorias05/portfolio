import { useState } from "react";
import toast from "react-hot-toast";
import { noImage2 } from "@/constants";
import ExperienceForm from "./ExperienceForm";
import DeletionModal from "../DeletionModal";
import Duration from "../Duration";

const Experience = ({ experience, fetchExperiences }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteExperience = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/experience/${experience._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchExperiences();
        toast.success("Experience removed successfully");
      } else {
        toast.error("Failed to remove experience");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return editMode ? (
    <ExperienceForm
      close={() => setEditMode(false)}
      initialData={experience}
      fetchExperiences={fetchExperiences}
    />
  ) : (
    <div>
      <div
        key={experience._id}
        className="work-content_container text-white-600 bg-black-300"
      >
        <div className="flex flex-col h-full justify-start items-center py-2">
          <div className="work-content_logo">
            <img
              src={experience.image || noImage2}
              alt="logo"
              className="w-full h-full"
            />
          </div>
          <div className="work-content_bar" />
        </div>
        <div className="sm:p-5 px-2.5 py-5">
          <div className="flex justify-between gap-4 w-full">
            <p className="font-bold text-white-800">{experience.name}</p>
            <div className="flex gap-2 items-center">
              <button className="acc" onClick={() => setEditMode(true)}>
                <img
                  src="/assets/edit-btn.png"
                  alt="edit"
                  className="w-5 h-5"
                />
              </button>
              <button
                className="error"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <img
                  src="/assets/remove-btn.png"
                  alt="remove"
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>
          <div className="text-sm flex flex-wrap gap-1 mb-5">
            <p>{experience.position}</p>
            <p>|</p>
            <Duration start={experience.start} end={experience.end} />
          </div>
          <p className="transition ease-in-out duration-500 whitespace-pre-line">
            {experience.description}
          </p>
        </div>
      </div>
      {showDeleteConfirm && (
        <DeletionModal
          text={"Are you sure you want to remove this experience?"}
          setShowDeleteConfirm={setShowDeleteConfirm}
          confirm={deleteExperience}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Experience;
