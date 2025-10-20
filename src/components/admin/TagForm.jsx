import { useEffect, useRef, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
import { storage } from "@/app/lib/firebase";
import { noImage2 } from "@/constants";

const TagForm = ({ close, initialData, fetchTags }) => {
  const mode = initialData ? "Update" : "Add";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      image: "",
      color: "",
      isDark: true,
    }
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const fileName = "portfolio-tags/" + new Date().getTime() + file.name;
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
    if (mode === "Add") {
      await fetch("/api/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(`/api/tag/${initialData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setLoading(false);
    close();
    fetchTags();
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <form action="" onSubmit={handleSubmit} className="p-4 border border-white-500 rounded-xl w-full">
      <h2 className="text-2xl font-semibold mb-4 text-white">{mode} Tag</h2>
      <div className="w-full flex gap-2">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <div className="w-32 self-center object-cover flex flex-col items-center justify-center">
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
          <div className="flex gap-2 m-2">
            <input
              type="checkbox"
              name="isDark"
              checked={formData.isDark}
              onChange={handleChange}
            />
            <label className="field-label">IsDark</label>
          </div>
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
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              name="color"
              value={formData.color || "#000000"}
              onChange={handleChange}
              className="h-12 w-12 p-0 border rounded cursor-pointer"
            />
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="field-input w-full"
              placeholder="#000000"
              required
            />
          </div>
        </div>
      </div>
      <div className="w-full flex gap-2 mt-2">
        <a type="button" onClick={close} className="field-btn cursor-pointer">
          Cancel
        </a>
        <button type="submit" className="field-btn">
          {loading ? "Loading..." : `${mode} Tag`}
        </button>
      </div>
    </form>
  );
};

export default TagForm;
