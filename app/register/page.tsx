
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HeartPulse,
  CalendarDays,
  FileHeart,
  ShieldCheck,
  UserRound,
  Mail,
  LockKeyhole,
  Phone,
  Stethoscope,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import "../../styles/style2.css";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
    contact: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const url =
      formData.role === "doctor"
        ? "http://localhost:2000/api/doctors/register"
        : "http://localhost:2000/api/patient/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User registered successfully");
        router.push("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-page">
      {/* LEFT INTRODUCTION PANEL */}
      <section className="register-intro">
        <Link href="/" className="register-brand">
          <span className="register-brand-icon">
            <HeartPulse size={34} strokeWidth={1.8} />
          </span>

          <span className="register-brand-name">
            Ever<span>Care</span>
            <small>HEALTHCARE MANAGEMENT SYSTEM</small>
          </span>
        </Link>

        <div className="register-intro-content">
          <span className="register-eyebrow">
            YOUR HEALTH, OUR PRIORITY
          </span>

          <h1>
            Join EverCare.
            <span>Your Health Matters.</span>
          </h1>

          <p className="register-description">
            Create your account to access convenient healthcare
            services, connect with medical professionals, and
            manage your healthcare journey in one place.
          </p>

          <div className="register-benefits">
            <div className="register-benefit">
              <span className="register-benefit-icon">
                <CalendarDays size={24} />
              </span>
              <div>
                <h3>Easy Appointments</h3>
                <p>Make your healthcare appointments easier to manage.</p>
              </div>
            </div>

            <div className="register-benefit">
              <span className="register-benefit-icon">
                <FileHeart size={24} />
              </span>
              <div>
                <h3>Healthcare Access</h3>
                <p>Stay connected with your healthcare information.</p>
              </div>
            </div>

            <div className="register-benefit">
              <span className="register-benefit-icon">
                <ShieldCheck size={24} />
              </span>
              <div>
                <h3>Care You Can Trust</h3>
                <p>A convenient platform for patients and doctors.</p>
              </div>
            </div>
          </div>
        </div>



        <p className="register-tagline">
          Better Care.
          <span>A Healthier Tomorrow.</span>
        </p>
      </section>

      {/* RIGHT REGISTRATION PANEL */}
      <section className="register-form-section">
        <div className="register-card">
          <div className="register-card-brand">
            <span className="register-card-logo">
              <HeartPulse size={29} />
            </span>
            <span>
              Ever<span>Care</span>
            </span>
          </div>

          <div className="register-card-heading">
            <span className="register-card-eyebrow">
              GET STARTED TODAY
            </span>
            <h2>Create Your Account</h2>
            <p>
              Join EverCare to access healthcare services.
            </p>
          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            {/* ROLE SELECTOR */}
            <div className="register-role-selector">
              <button
                type="button"
                className={
                  formData.role === "patient"
                    ? "register-role active"
                    : "register-role"
                }
                onClick={() =>
                  setFormData((previous) => ({
                    ...previous,
                    role: "patient",
                  }))
                }
                aria-pressed={formData.role === "patient"}
              >
                <UserRound size={19} />
                Patient
              </button>

              <button
                type="button"
                className={
                  formData.role === "doctor"
                    ? "register-role active"
                    : "register-role"
                }
                onClick={() =>
                  setFormData((previous) => ({
                    ...previous,
                    role: "doctor",
                  }))
                }
                aria-pressed={formData.role === "doctor"}
              >
                <Stethoscope size={19} />
                Doctor
              </button>
            </div>

            <div className="register-fields">
              <div className="register-field">
                <label htmlFor="register-name">
                  Full Name
                </label>
                <div className="register-input-wrap">
                  <UserRound size={18} />
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="register-email">
                  Email Address
                </label>
                <div className="register-input-wrap">
                  <Mail size={18} />
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="register-contact">
                  {formData.role === "doctor"
                    ? "Contact Number"
                    : "Phone Number"}
                </label>
                <div className="register-input-wrap">
                  <Phone size={18} />
                  <input
                    id="register-contact"
                    type="tel"
                    name="contact"
                    placeholder="Enter your phone number"
                    value={formData.contact}
                    onChange={handleChange}
                    autoComplete="tel"
                    required={formData.role === "doctor"}
                  />
                </div>
              </div>

              {formData.role === "doctor" && (
                <div className="register-field">
                  <label htmlFor="register-specialization">
                    Specialization
                  </label>
                  <div className="register-input-wrap">
                    <Stethoscope size={18} />
                    <input
                      id="register-specialization"
                      type="text"
                      name="specialization"
                      placeholder="e.g. Cardiology"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="register-field">
                <label htmlFor="register-password">
                  Password
                </label>
                <div className="register-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="register-security-note">
              <ShieldCheck size={16} />
              Your information is used to create your account.
            </p>

            <button
              type="submit"
              className="register-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Creating Account..."
              ) : (
                <>
                  <UserPlus size={19} />
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="register-divider">
              <span>ALREADY A MEMBER?</span>
            </div>

            <p className="register-login-prompt">
              Already have an account?{" "}
              <Link href="/login">Sign in</Link>
            </p>
          </form>
        </div>

        <p className="register-footer-note">
          EverCare Healthcare Management System
        </p>
      </section>
    </main>
  );
}
