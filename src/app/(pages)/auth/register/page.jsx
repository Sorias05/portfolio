"use client";
import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { storage } from "@/app/lib/firebase";
import { noImage } from "@/constants";

const Page = () => {
  const fileRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: noImage,
    organization: "",
    position: "",
  });

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const validateForm = () => {
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      toast.error(
        "Invalid email format"
      );
      return false;
    }

    if (
      formData.password.length < 8 ||
      !/\d/.test(formData.password) ||
      !/[a-zA-Z]/.test(formData.password)
    ) {
      setError(
        "Password must be at least 8 characters long and contain at least one letter and one number"
      );
      toast.error(
        "Password must be at least 8 characters long and contain at least one letter and one number"
      );
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file) => {
    const fileName = "portfolio-users/" + new Date().getTime() + file.name;
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

          if (formData.image && formData.image !== noImage) {
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

  const handleProviderSignIn = async (provider) => {
    const res = await signIn(provider, {
      redirect: false,
    });

    if (res?.error) {
      setError("Authentication error: " + res.error);
      toast.error("Authentication error");
    } else {
      router.replace("/auth/complete");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.error) {
      setLoading(false);
      setError(res.error);
      toast.error(res.error);
    }
    if (res.ok) {
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      setLoading(false);
      router.replace("/auth/complete");
      toast.success("Main registration successful!");
    }
  };

  return (
    <section className="auth-section my-12">
      <h3 className="head-text">Registration</h3>
      <form onSubmit={handleSubmit} className="auth-container">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <div className="h-48 w-48 self-center object-cover flex items-center justify-center">
          {filePerc > 0 && filePerc < 100 ? (
            <span className="text-sm text-neutral-400">{`Uploading ${filePerc}%`}</span>
          ) : (
            <img
              onClick={() => fileRef.current.click()}
              src={formData.image}
              alt="profile"
              className="h-48 w-48 rounded-full object-cover cursor-pointer"
            />
          )}
        </div>
        <div className="flex gap-2">
          <div className="w-full">
            <label className="field-label">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="field-input"
            />
          </div>
          <div className="w-full">
            <label className="field-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="field-input"
            />
          </div>
        </div>
        <div className="w-full">
          <label className="field-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="field-input"
          />
        </div>
        <div className="w-full">
          <label className="field-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="field-input"
          />
        </div>
        <span className="error">{error || ""}</span>
        <button type="submit" className="field-btn">
          {loading ? "Loading..." : "Register"}
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            className="field-btn"
            onClick={() => handleProviderSignIn("google")}
          >
            <img src="/assets/google-btn.png" alt="google" className="h-6" />
          </button>

          <button
            type="button"
            className="field-btn"
            onClick={() => handleProviderSignIn("github")}
          >
            <img src="/assets/github-btn.png" alt="github" className="h-6" />
          </button>
        </div>
        <a className="acc" onClick={() => router.replace("/auth/login")}>
          Already have an account?
        </a>
      </form>
    </section>
  );
};

export default Page;
