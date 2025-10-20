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

const ExperienceForm = ({ close, initialData, fetchExperiences }) => {
  const mode = initialData ? "Update" : "Add";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      position: "",
      start: "",
      end: "",
      description: "",
      image: "",
      animation: "",
    }
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const fileName =
      "portfolio-experiences/" + new Date().getTime() + file.name;
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
    console.log(formData);
    
    if (mode === "Add") {
      await fetch("/api/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(`/api/experience/${initialData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setLoading(false);
    close();
    fetchExperiences();
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
      <h2 className="text-2xl font-semibold mb-4 text-white">
        {mode} Experience
      </h2>
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
        </div>
        <div className="w-full">
          <label className="field-label">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="field-input"
          />
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
          <label className="field-label">Position</label>
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            className="field-input"
          />
        </div>
        <div className="w-full">
          <label className="field-label">Animation</label>
          <input
            type="text"
            name="animation"
            placeholder="Animation"
            value={formData.animation}
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
      <div className="w-full flex gap-2 mt-2">
        <a type="button" onClick={close} className="field-btn cursor-pointer">
          Cancel
        </a>
        <button type="submit" className="field-btn">
          {loading ? "Loading..." : `${mode} Experience`}
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;
