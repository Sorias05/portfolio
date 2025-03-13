"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    organization: "",
    position: "",
    isCompleted: false,
  });

  useEffect(() => {
    if (session) {
      setFormData((prev) => ({
        ...prev,
        organization: session?.user?.organization || "",
        position: session?.user?.position || "",
        isCompleted: session?.user?.isCompleted || false,
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    formData.isCompleted = true;
    const res = await fetch(`/api/user/${session?.user?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
    if (res.ok) {
      await update();
      setLoading(false);
      router.replace("/");
      toast.success("Registration completed successfully!");
    }
  };

  return (
    <section className="auth-section">
      <h3 className="head-text">Complete Registration</h3>
      <form onSubmit={handleSubmit} className="auth-container">
        <div className="w-full">
          <label className="field-label">Organization</label>
          <input
            type="text"
            name="organization"
            placeholder="Organization"
            value={formData.organization}
            onChange={handleChange}
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
            required
            className="field-input"
          />
        </div>
        <span className="error"></span>
        <button type="submit" className="field-btn">
          {loading ? "Loading..." : "Complete Registration"}
        </button>
      </form>
    </section>
  );
};

export default Page;
