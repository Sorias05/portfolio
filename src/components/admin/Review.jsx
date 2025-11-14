import { useState } from "react";
import toast from "react-hot-toast";
import ReviewForm from "./ReviewForm";
import DeletionModal from "../DeletionModal";

const Review = ({ review, fetchReviews }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteReview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/review/${review._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchReviews();
        toast.success("Review removed successfully");
      } else {
        toast.error("Failed to remove review");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return editMode ? (
    <ReviewForm
      close={() => setEditMode(false)}
      initialData={review}
      fetchReviews={fetchReviews}
    />
  ) : (
    <div>
      <div key={review._id} className="client-review">
        <div className="flex justify-between">
          <p className="client-text">{review.title}</p>
          <div className="flex gap-2 items-start min-w-16">
            <button className="acc" onClick={() => setEditMode(true)}>
              <img src="/assets/edit-btn.png" alt="edit" className="w-5 h-5" />
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

        <div className="client-content">
          <div className="flex gap-2 overflow-hidden">
            <img
              src={review.user.image}
              alt={review.user.firstName + " " + review.user.lastName}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-semibold text-white-800 text-nowrap">
                {review.user.firstName + " " + review.user.lastName}
              </p>
              <p className="text-white-500 md:text-base text-sm font-light text-nowrap">
                {review.user.position + " at " + review.user.organization}
              </p>
            </div>
          </div>
          <div className="flex self-center justify-end gap-2 min-w-32">
            {Array.from({ length: 5 }).map((_, index) => {
              const hasFraction = review.stars % 1 !== 0;
              const isHalfStar =
                index === Math.floor(review.stars) && hasFraction;

              return (
                <img
                  key={index}
                  src={
                    index < Math.floor(review.stars)
                      ? "/assets/star1.png"
                      : isHalfStar
                      ? "/assets/star3.png"
                      : "/assets/star2.png"
                  }
                  alt="star"
                  className="w-5 h-5"
                />
              );
            })}
          </div>
        </div>
      </div>
      {showDeleteConfirm && (
        <DeletionModal
          text={"Are you sure you want to remove this review?"}
          setShowDeleteConfirm={setShowDeleteConfirm}
          confirm={deleteReview}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Review;
