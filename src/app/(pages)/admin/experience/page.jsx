"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ExperienceForm from "@/components/admin/ExperienceForm";
import Experience from "@/components/admin/Experience";

const Page = () => {
  const [experiences, setExperiences] = useState([]);
  const [addExperience, setAddExperience] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`/api/experience`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch experiences data");
      }

      const data = await response.json();

      setExperiences(data);
    } catch (err) {
      toast.error("Failed to load experiences data.");
    }
  };

  return (
    <div className="my-4 space-y-4">
      <h3 className="grid-headtext text-center w-full">Experience</h3>
      {experiences.length > 0 &&
        experiences.map((experience) => (
          <Experience
            key={experience._id}
            experience={experience}
            fetchExperiences={fetchExperiences}
          />
        ))}
      {addExperience ? (
        <ExperienceForm
          close={() => setAddExperience(false)}
          fetchExperiences={() => fetchExperiences()}
        />
      ) : (
        <button
          onClick={() => setAddExperience(true)}
          className="field-btn w-full"
        >
          Add
        </button>
      )}
    </div>
  );
};

export default Page;
