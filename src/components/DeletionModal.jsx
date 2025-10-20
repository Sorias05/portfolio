import React from "react";

const DeletionModal = ({ text, setShowDeleteConfirm, confirm, loading }) => {
  return (
    <div className="deletion">
      <div className="deletion-container">
        <p className="field-label">
          {text}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="field-btn"
          >
            Cancel
          </button>
          <button onClick={confirm} className="field-red-btn">
            {loading ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletionModal;
