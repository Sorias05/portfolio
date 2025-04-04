"use client";
import Review from "@/components/Review";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [reviews, setReviews] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (reviews.length === 0) fetchReviews();
  }, [reviews]);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/review", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "only-chosen": "false",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      toast.error("Failed to load reviews.");
    }
  };

  return (
    <section className="c-space my-24" id="clients">
      <div className="flex justify-between">
        <h3 className="head-text">Hear from My Clients</h3>
        <div className="flex items-end gap-5">
          <button
            onClick={() => {
              if (session) {
                localStorage.setItem("scrollToReview", "true");
                router.replace(`/user/${session.user.id}/#review`);
              } else {
                router.replace("/auth/login");
              }
            }}
          >
            <img src="/assets/add.svg" alt="edit" className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div
        className={`client-container ${
          reviews.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2"
        }`}
      >
        {reviews.map(({ _id, title, stars, user }) => (
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
      </div>
    </section>
  );
};
export default Page;
