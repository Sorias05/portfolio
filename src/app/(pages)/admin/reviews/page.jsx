"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReviewForm from "@/components/admin/ReviewForm";
import Review from "@/components/admin/Review";

const Page = () => {
  const [reviews, setReviews] = useState([]);
  const [addReview, setAddReview] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/review`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews data");
      }

      const data = await response.json();

      setReviews(data);
    } catch (err) {
      toast.error("Failed to load reviews data.");
    }
  };

  return (
    <div className="my-4 space-y-4">
      <h3 className="grid-headtext text-center w-full">Review</h3>
      {reviews.length > 0 &&
        reviews.map((review) => (
          <Review
            key={review._id}
            review={review}
            fetchReviews={fetchReviews}
          />
        ))}
      {addReview ? (
        <ReviewForm
          close={() => setAddReview(false)}
          fetchReviews={() => fetchReviews()}
        />
      ) : (
        <button
          onClick={() => setAddReview(true)}
          className="field-btn w-full"
        >
          Add
        </button>
      )}
    </div>
  );
};

export default Page;
