import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ReviewForm = ({ close, initialData, fetchReviews }) => {
  const mode = initialData ? "Update" : "Add";
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      stars: 0,
      chosen: false,
      userId: "",
      user: {},
    }
  );
  const [selectedStars, setSelectedStars] = useState(initialData?.stars);
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
    setFormData({ ...formData, stars: newRating });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }

      const data = await response.json();

      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users data.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "Add") {
      try {
        const response = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Review added successfully!");
        } else {
          toast.error("Failed to add review");
        }
      } catch (err) {
        toast.error("Something went wrong");
      }
    } else {
      try {
        const response = await fetch(`/api/review/${initialData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Review added successfully!");
        } else {
          toast.error("Failed to add review");
        }
      } catch (err) {
        toast.error("Something went wrong");
      }
    }
    setLoading(false);
    close();
    fetchReviews();
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="p-4 border border-white-500 rounded-xl w-full"
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">{mode} Review</h2>
      <div className="w-full flex justify-between items-center">
        <div className="flex" name="stars">
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
                className="w-7 h-5 cursor-pointer px-1"
                onMouseMove={(event) => handleMouseMove(event, index)}
                onMouseLeave={handleMouseLeave}
                onClick={(event) => handleClick(event, index)}
              />
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            type="checkbox"
            name="chosen"
            checked={formData.chosen}
            onChange={handleChange}
          />
          <label className="field-label">Chosen</label>
        </div>
      </div>
      <div className="w-full">
        <label className="field-label">Title</label>
        <textarea
          name="title"
          placeholder="Title"
          required
          value={formData.title}
          onChange={handleChange}
          className="field-input"
        />
      </div>
      <div>
        <label className="field-label">User</label>
        <select
          name="userId"
          placeholder="User"
          required
          value={formData.userId}
          onChange={handleChange}
          className="field-input"
        >
          <option value="">Choose User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName + " " + user.lastName + " (" + user.email + ")"}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full flex gap-2 mt-2">
        <a type="button" onClick={close} className="field-btn cursor-pointer">
          Cancel
        </a>
        <button type="submit" className="field-btn">
          {loading ? "Loading..." : `${mode} Review`}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
