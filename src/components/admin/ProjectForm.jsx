import { useEffect, useRef, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { storage } from "@/app/lib/firebase";
import { noImage2 } from "@/constants";
import TagForm from "./TagForm";
import MultiSelect from "./MultiSelect";

const ProjectForm = ({ close, initialData, fetchProjects }) => {
  const mode = initialData ? "Update" : "Add";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [addTag, setAddTag] = useState(false);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      url: "",
      image: "",
      description: "",
      start: "",
      end: "",
      video: "",
      clickable: false,
      pet: true,
      tag_ids: [],
      tags: [],
    }
  );

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const fileName = "portfolio-projects/" + new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setError("Error uploading file:" + error);
        toast.error("Error uploading file");
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          if (formData.image && formData.image !== noImage2) {
            try {
              const oldImageRef = ref(storage, formData.image);
              await deleteObject(oldImageRef);
            } catch (deleteError) {
              console.error("Error deleting old image:", deleteError);
            }
          }

          setFormData({ ...formData, image: downloadURL });
          toast.success("Image uploaded successfully!");
        } catch (error) {
          setError("Error getting download URL:" + error);
          toast.error("Error getting download URL");
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { tags, ...data } = formData;
    if (mode === "Add") {
      await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`/api/project/${initialData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setLoading(false);
    close();
    fetchProjects();
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    console.log(formData);
  };

  const handleTags = (tags) => {
    setFormData({
      ...formData,
      tags: tags,
      tag_ids: tags.map((tag) => tag._id),
    });
  };

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
    <form action="" onSubmit={handleSubmit} className="p-4 border border-white-500 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-white">{mode} Project</h2>
      <div className="w-full flex gap-2">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <div className="h-24 w-32 self-center object-cover flex items-center justify-center">
          {filePerc > 0 && filePerc < 100 ? (
            <span className="text-sm text-neutral-400">{`Uploading ${filePerc}%`}</span>
          ) : (
            <img
              onClick={() => fileRef.current.click()}
              src={formData.image || noImage2}
              alt="profile"
              className="h-24 w-24 object-cover cursor-pointer"
            />
          )}
        </div>
        <div className="w-full">
          <label className="field-label">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            value={formData.title}
            onChange={handleChange}
            className="field-input"
          />
          <div className="w-full flex gap-2 m-2">
            <input
              type="checkbox"
              name="clickable"
              checked={formData.clickable}
              onChange={handleChange}
            />
            <label className="field-label">Clickable</label>
          </div>
        </div>
      </div>
      <div className="w-full">
        <label className="field-label">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          required
          value={formData.description}
          onChange={handleChange}
          className="field-input"
        />
      </div>
      <div className="w-full flex gap-2">
        <div className="w-full">
          <label className="field-label">Url</label>
          <input
            type="text"
            name="url"
            placeholder="Url"
            value={formData.url}
            onChange={handleChange}
            className="field-input"
          />
        </div>
        <div className="w-full">
          <label className="field-label">Video</label>
          <input
            type="text"
            name="video"
            placeholder="Video"
            value={formData.video}
            onChange={handleChange}
            className="field-input"
          />
        </div>
      </div>
      <div className="w-full">
        <label className="field-label">Duration</label>
        <div className="flex gap-2 items-center text-white">
          <input
            type="month"
            name="start"
            placeholder="Start"
            required
            value={formData.start}
            onChange={handleChange}
            className="field-input min-w-0"
          />
          -
          <input
            type="month"
            name="end"
            placeholder="End"
            value={formData.end}
            onChange={handleChange}
            className="field-input min-w-0"
          />
        </div>
      </div>
      <div className="w-full">
        <label className="field-label">Tags</label>
        <MultiSelect
          options={tags.map((tag) => ({ label: tag.title, value: tag }))}
          value={formData.tags}
          onChange={handleTags}
        />
      </div>
      {addTag ? (
        <div className="flex gap-2 m-2 p-2 border border-black-300 rounded-lg">
          <TagForm close={() => setAddTag(false)} />
        </div>
      ) : (
        <button
          type="button"
          className="field-btn mt-2"
          onClick={() => router.push("/admin/tags")}
        >
          Add Tag
        </button>
      )}
      <div className="w-full flex gap-2 mt-2">
        <a type="button" onClick={close} className="field-btn cursor-pointer">
          Cancel
        </a>
        <button type="submit" className="field-btn">
          {loading ? "Loading..." : mode}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
