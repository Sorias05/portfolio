"use client";
import ProfileReview from "@/components/ProfileReview";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProfileReviews = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [isReviewEditMode, setIsReviewEditMode] = useState(false);
  const [reviewData, setReviewData] = useState({
    title: "",
    stars: 0,
    userId: userId,
  });
  const [review, setReview] = useState(undefined);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(null);

  useEffect(() => {
    fetchReview();
  }, []);

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

  const addReview = async () => {
    try {
      setLoading(true);
      const addedReview = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...reviewData, userId }),
      });
      if (addedReview.ok) {
        fetchReview();
        toast.success("Thank you for your review!");
      } else {
        toast.error("Something went wrong");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const fetchReview = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/review", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Failed to fetch review data");
      }

      const data = await response.json();
      setReview(data[0]);
      setReviewData(review);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const cancelReview = () => {
    setIsReviewEditMode(false);
    setReviewData({ title: "", stars: 0, userId });
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
      addReview();
      setLoading(false);
      setIsReviewEditMode(false);
    }
  };

  return (
    <>
      <h3 className="head-text">Your Review</h3>
      {review ? (
        <div className="flex flex-col gap-2 max-w-xl w-full">
          {/* <div className="flex flex-col gap-5 max-w-xl w-full">
            {user.reviews.map(({ _id, title, stars }) => (
              <Review
                key={_id}
                _id={_id}
                title={title}
                stars={stars}
                name={user.firstName + " " + user.lastName}
                image={user.image}
                position={user.position + " at " + user.organization}
              />
            ))}
          </div> */}
          <ProfileReview
            _id={review._id}
            title={review.title}
            stars={review.stars}
            userId={userId}
            fetchReview={fetchReview}
          />
        </div>
      ) : loading ? (
        <p className="text-white text-md">Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmitReview}
          className="flex flex-col gap-2 max-w-xl w-full"
        >
          {isReviewEditMode ? (
            <div className="profile-review">
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
                  rows={2}
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
                  {loading ? "Loading..." : "Add"}
                </button>
              </div>
            </div>
          ) : (
            <button type="submit" className="field-btn">
              {loading ? "Loading..." : "Add Review"}
            </button>
          )}
        </form>
      )}
    </>
  );
};

export default ProfileReviews;
