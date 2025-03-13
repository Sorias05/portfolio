import React, { useState } from "react";
import toast from "react-hot-toast";

const ProfileReview = ({ _id, title, stars, userId, fetchReview }) => {
  const [loading, setLoading] = useState(false);
  const [isReviewEditMode, setIsReviewEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewData, setReviewData] = useState({
    title,
    stars,
    userId,
  });
  const [selectedStars, setSelectedStars] = useState(stars);
  const [hoveredStars, setHoveredStars] = useState(null);

  const handleMouseMove = (event, index) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - left < width / 2;
    setHoveredStars(index + (isHalf ? 0.5 : 1));
  };

  const handleMouseLeave = () => setHoveredStars(null);

  const handleClick = (event, index) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - left < width / 2;
    const newRating = index + (isHalf ? 0.5 : 1);
    setSelectedStars(newRating);
    setReviewData({ ...reviewData, stars: newRating });
  };

  const updateReview = async () => {
    try {
      setLoading(true);
      const updateedReview = await fetch(`/api/review/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...reviewData }),
      });
      if (updateedReview.ok) {
        fetchReview();
        toast.success("Reveiw updated successfully!");
      } else {
        toast.error("Something went wrong");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteReview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/review/${_id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchReview();
        toast.success("Review removed successfully!");
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

  const countLines = (text) => {
    return text.trim() === "" ? 0 : text.split("\n").length;
  };

  const cancelReview = () => {
    setIsReviewEditMode(false);
    setReviewData({ title, stars, userId });
  };

  const handleReviewChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!isReviewEditMode) {
      setIsReviewEditMode(true);
    } else {
      setLoading(true);
      updateReview();
      setLoading(false);
      setIsReviewEditMode(false);
    }
  };

  return (
    <div key={_id} className="profile-review">
      {isReviewEditMode ? (
        <form
          onSubmit={handleSubmitReview}
          className="flex flex-col gap-2 max-w-xl w-full"
        >
          <div className="flex flex-col w-full gap-2">
            <div className="flex self-start gap-2 px-1" name="stars">
              {Array.from({ length: 5 }).map((_, index) => {
                const starsToShow =
                  hoveredStars !== null ? hoveredStars : selectedStars;
                const isHalfStar = index + 0.5 === starsToShow;

                return (
                  <img
                    key={index}
                    src={
                      index + 1 <= starsToShow
                        ? "/assets/star1.png"
                        : isHalfStar
                        ? "/assets/star3.png"
                        : "/assets/star2.png"
                    }
                    alt="star"
                    name="stars"
                    className="w-5 h-5 cursor-pointer"
                    onMouseMove={(event) => handleMouseMove(event, index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={(event) => handleClick(event, index)}
                  />
                );
              })}
            </div>
            <textarea
              name="title"
              value={reviewData?.title}
              onChange={handleReviewChange}
              required
              rows={countLines(reviewData?.title)}
              className="field-input"
              placeholder="This guy is impressive..."
            />
          </div>
          <div className="w-full flex gap-2">
            <a
              type="button"
              onClick={cancelReview}
              className="field-btn cursor-pointer"
            >
              Cancel
            </a>
            <button type="submit" className="field-btn">
              {loading ? "Loading..." : "Update"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between h-5">
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const hasFraction = stars % 1 !== 0;
                const isHalfStar = index === Math.floor(stars) && hasFraction;

                return (
                  <img
                    key={index}
                    src={
                      index < Math.floor(stars)
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
            <div className="flex gap-2">
              <button onClick={() => setIsReviewEditMode(true)}>
                <img
                  src="/assets/edit-btn.png"
                  alt="edit"
                  className="w-5 h-5"
                />
              </button>
              <button onClick={() => setShowDeleteConfirm(true)}>
                <img
                  src="/assets/remove-btn.png"
                  alt="remove"
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          <p className="client-text">{title}</p>
        </>
      )}
      {showDeleteConfirm && (
        <div className="deletion">
          <div className="deletion-container">
            <p className="field-label">
              Are you sure you want to delete this review?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="field-btn"
              >
                Cancel
              </button>
              <button onClick={deleteReview} className="field-red-btn">
                {loading ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileReview;
