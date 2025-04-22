"use client";
import { signOut, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ErrorPage from "next/error";
import toast from "react-hot-toast";
import { storage } from "@/app/lib/firebase";
import { noImage } from "@/constants";
import ProfileReviews from "@/sections/ProfileReviews";

const Page = () => {
  const params = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const [isPersistent, setIsPersistent] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletion, setDeletion] = useState("");
  const router = useRouter();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    image: "" || noImage,
    organization: "",
    position: "",
    isCompleted: false,
  });

  useEffect(() => {
    if (!params?.id || params?.id !== session?.user?.id) {
      setIsPersistent(false);
    } else {
      fetchUser();
      setIsPersistent(true);
    }
  }, [params, session]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    const shouldScroll = localStorage.getItem("scrollToReview");
    if (shouldScroll === "true") {
      localStorage.removeItem("scrollToReview");
      const scrollToReview = () => {
        const element = document.getElementById("review");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          setTimeout(scrollToReview, 100);
        }
      };
      scrollToReview();
    }
  }, [router.asPath]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setFormData({ ...data });
    } catch (err) {
      toast.error("Failed to load user data.");
    }
  };

  const updateUser = async () => {
    try {
      const updatedUser = await fetch(`/api/user/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (updatedUser.ok) {
        await update();
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteUser = async () => {
    try {
      if (deletion === formData.email) {
        if (formData.image && formData.image !== noImage) {
          try {
            const oldImageRef = ref(storage, formData.image);
            await deleteObject(oldImageRef);
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
          }
        }
        setLoading(true);
        const response = await fetch(`/api/user/${params.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await signOut({ redirect: false }).then(() => {
            router.push("/");
          });
          router.replace("/");
          toast.success("User removed successfully!");
        } else {
          toast.error("Failed to remove user");
        }
        setLoading(false);
        setShowDeleteConfirm(false);
      } else {
        toast.error("Email is incorrect.");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
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

          if (formData.image && formData.image !== noImage && formData.image !== session.user?.image) {
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

  const cancel = () => {
    setIsEditMode(false);
    fetchUser();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditMode) {
      setIsEditMode(true);
    } else {
      setLoading(true);
      updateUser();
      setLoading(false);
      setIsEditMode(false);
    }
  };

  if (!isPersistent) return <ErrorPage statusCode={404} />;

  return (
    <section className="profile-section my-24">
      <h3 className="head-text">Profile</h3>
      <form onSubmit={handleSubmit} className="auth-container">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          disabled={!isEditMode}
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
              disabled={!isEditMode}
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
              disabled={!isEditMode}
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
            disabled
            className="field-input"
          />
        </div>
        <div className="w-full">
          <label className="field-label">Organization</label>
          <input
            type="text"
            name="organization"
            placeholder="Organization"
            value={formData.organization}
            onChange={handleChange}
            disabled={!isEditMode}
            required
            className="field-input"
          />
        </div>
        <div className="w-full">
          <label className="field-label">Position</label>
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            disabled={!isEditMode}
            required
            className="field-input"
          />
        </div>
        <span className="error">{error || ""}</span>
        <div className="w-full flex gap-2">
          {isEditMode ? (
            <>
              <a
                type="button"
                onClick={cancel}
                className="field-btn cursor-pointer"
              >
                Cancel
              </a>
              <button type="submit" className="field-btn">
                {loading ? "Loading..." : "Update"}
              </button>
            </>
          ) : (
            <button type="submit" className="field-btn">
              {loading ? "Loading..." : "Edit"}
            </button>
          )}
        </div>
        <div className="w-full flex justify-between gap-2">
          <a
            onClick={async () => {
              await signOut({ redirect: false }).then(() => {
                router.push("/");
              });
            }}
            className="acc w-3/4"
          >
            Logout
          </a>
          <a
            onClick={() => setShowDeleteConfirm(true)}
            className="error cursor-pointer w-1/4 text-right"
          >
            Remove Account
          </a>
        </div>
      </form>
      <section
        className="flex flex-col gap-5 max-w-xl w-full items-center mt-8"
        id="review"
      >
        <ProfileReviews userId={params.id} />
      </section>
      {showDeleteConfirm && (
        <div className="deletion">
          <div className="deletion-container">
            <p className="field-label">
              Write your email to remove your account:
            </p>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={deletion}
              onChange={(e) => {
                setDeletion(e.target.value);
              }}
              className="field-input"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletion("");
                }}
                className="field-btn"
              >
                Cancel
              </button>
              <button onClick={deleteUser} className="field-red-btn">
                {loading ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
