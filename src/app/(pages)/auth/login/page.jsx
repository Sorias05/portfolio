"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const { update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleProviderSignIn = async (provider) => {
    const res = await signIn(provider, {
      redirect: false,
    });

    if (res?.error) {
      setError("Authentication error:" + res.error);
      toast.error("Authentication error");
    } else {
      router.replace("/auth/complete");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    if (res?.error) {
      setLoading(false);
      setError(res.error);
      toast.error(res.error);
    }
    if (res?.ok) {
      await update();
      setLoading(false);
      router.replace("/");
      toast.success("Login successful!");
    }
  };

  return (
    <section className="auth-section">
      <h3 className="head-text">Login</h3>
      <form className="auth-container" onSubmit={handleSubmit}>
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
          {loading ? "Loading..." : "Login"}
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

        <a
          className="acc"
          onClick={() => router.replace("/auth/register")}
        >
          Don't have an account?
        </a>
      </form>
    </section>
  );
};

export default Page;
