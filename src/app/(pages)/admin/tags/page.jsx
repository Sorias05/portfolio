"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TagForm from "@/components/admin/TagForm";
import TagAdmin from "@/components/admin/TagAdmin";

const Page = () => {
  const [tags, setTags] = useState([]);
  const [addTag, setAddTag] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch(`/api/tag`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tags data");
      }

      const data = await response.json();

      setTags(data);
    } catch (err) {
      toast.error("Failed to load tags data.");
    }
  };

  return (
    <div className="my-4 space-y-4">
      <h3 className="grid-headtext text-center w-full">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 &&
          tags.map((tag) => (
            <TagAdmin key={tag._id} tag={tag} fetchTags={() => fetchTags()} />
          ))}
      </div>
      {addTag ? (
        <TagForm close={() => setAddTag(false)} fetchTags={() => fetchTags()} />
      ) : (
        <button onClick={() => setAddTag(true)} className="field-btn w-full">
          Add
        </button>
      )}
    </div>
  );
};

export default Page;
