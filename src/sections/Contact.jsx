"use client";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { developer, emailConfig, firebaseConfig } from "@/constants";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const Contact = () => {
  const formRef = useRef();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (session) {
      setForm({
        firstName: session?.user?.firstName || "",
        lastName: session?.user?.lastName || "",
        email: session?.user?.email || "",
      });
    }
  }, [session]);

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        {
          from_name: `${form.firstName} ${form.lastName}`,
          to_name: developer,
          from_email: form.email,
          to_email: emailConfig.email,
          message: form.message,
        },
        emailConfig.publicKey
      );

      setLoading(false);
      setForm({
        firstName: session?.user?.firstName || "",
        lastName: session?.user?.lastName || "",
        email: session?.user?.email || "",
        message: "",
      });
      toast.success("Your message has been sent successfully!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <section className="contact-section my-12" id="contact">
      <h3 className="head-text">Contact Me</h3>
      <form ref={formRef} onSubmit={handleSubmit} className="auth-container">
        <div className="flex gap-2">
          <div className="w-full">
            <label className="field-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="field-input"
              placeholder="John Doe"
            />
          </div>
          <div className="w-full">
            <label className="field-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="field-input"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div className="w-full">
          <label className="field-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!!session}
            required
            className="field-input"
            placeholder="johndoe@gmail.com"
          />
        </div>
        <div className="w-full">
          <label className="field-label">Your Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="field-input"
            placeholder="Hi, I am interested in..."
          />
        </div>
        <button className="field-btn" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
          <img
            src="/assets/arrow-up.png"
            alt="arrow-up"
            className="field-btn_img"
          />
        </button>
      </form>
    </section>
  );
};

export default Contact;
