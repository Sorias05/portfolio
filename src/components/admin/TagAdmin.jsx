import { useState } from "react";
import toast from "react-hot-toast";
import { noImage2 } from "@/constants";
import TagForm from "./TagForm";
import DeletionModal from "../DeletionModal";

const TagAdmin = ({ tag, fetchTags }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteTag = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tag/${tag._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchTags();
        toast.success("Tag removed successfully");
      } else {
        toast.error("Failed to remove tag");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return editMode ? (
    <TagForm
      close={() => setEditMode(false)}
      initialData={tag}
      fetchTags={fetchTags}
    />
  ) : (
    <div key={tag._id}>
      <span
        className={`px-2 py-1 rounded text-xs flex items-center gap-1 border border-gray-400 ${
          tag.isDark ? "text-white" : "text-black"
        }`}
        style={{ backgroundColor: tag.color }}
      >
        <img src={tag.image || noImage2} alt={tag.title} className="w-4 h-4" />
        <p>{tag.title}</p>
        <div className="flex ml-2">
          <button className="acc" onClick={() => setEditMode(true)}>
            <img src="/assets/edit-btn.png" alt="edit" className="w-4 h-4" />
          </button>
          <button className="error" onClick={() => setShowDeleteConfirm(true)}>
            <img
              src="/assets/remove-btn.png"
              alt="remove"
              className="w-4 h-4"
            />
          </button>
        </div>
      </span>
      {showDeleteConfirm && (
        <DeletionModal
          text={"Are you sure you want to remove this tag?"}
          setShowDeleteConfirm={setShowDeleteConfirm}
          confirm={deleteTag}
          loading={loading}
        />
      )}
    </div>
  );
};

export default TagAdmin;
