
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HeartPulse,
  CalendarDays,
  ShieldCheck,
  Stethoscope,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";
import "../../styles/style2.css";

export default function Login() {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const url =
      loginData.role === "doctor"
        ? "http://localhost:2000/api/doctors/login"
        : "http://localhost:2000/api/patient/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Login failed. Please try again.");
        return;
      }

      const user = data.data;

      alert("Login Successful");

      localStorage.setItem("token", user.AccessTokens || "");
      localStorage.setItem("patientEmail", user.email || "");

      if (loginData.role === "doctor") {
        localStorage.setItem("doctorId", user.id || "");
        localStorage.setItem("doctorName", user.name || "");
        localStorage.setItem("role", user.role || "doctor");

        router.push("/doctor");
      } else {
        localStorage.setItem("patientId", user.id || "");
        localStorage.setItem("patientName", user.name || "");
        localStorage.setItem("role", user.role || "patient");

        router.push("/patient");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* Left: EverCare introduction */}
      <section className="login-intro">
        <Link href="/" className="login-brand">
          <span className="login-brand-icon">
            <HeartPulse size={38} strokeWidth={1.8} />
          </span>

          <span className="login-brand-text">
            <span className="login-brand-name">
              Ever<span>Care</span>
            </span>
            <span className="login-brand-tagline">
              HEALTHCARE MANAGEMENT SYSTEM
            </span>
          </span>
        </Link>

        <div className="login-intro-content">
          <span className="login-eyebrow">
            WELCOME TO EVERCARE
          </span>

          <h1>
            Better Care.
            <span>A Healthier Tomorrow.</span>
          </h1>

          <p className="login-intro-description">
            Your trusted partner in healthcare management.
            Book appointments, access your records, and stay
            connected with your healthcare team in one place.
          </p>

          <div className="login-benefits">
            <div className="login-benefit">
              <span className="login-benefit-icon">
                <CalendarDays size={23} />
              </span>
              <div>
                <h3>Book Appointments</h3>
                <p>Simple and convenient scheduling</p>
              </div>
            </div>

            <div className="login-benefit">
              <span className="login-benefit-icon">
                <HeartPulse size={23} />
              </span>
              <div>
                <h3>Manage Your Health</h3>
                <p>Keep your healthcare information accessible</p>
              </div>
            </div>

            <div className="login-benefit">
              <span className="login-benefit-icon">
                <Stethoscope size={23} />
              </span>
              <div>
                <h3>Trusted Healthcare</h3>
                <p>Stay connected with your care team</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-trust-note">
          <ShieldCheck size={20} />
          <span>Your Health, Our Priority</span>
          <div className="login-doctor-image">
  <img
    src="/image/i.jpg"
    alt="Doctor representing EverCare healthcare services"
  />
</div>
        </div>
      </section>

      {/* Right: Login form */}
      <section className="login-form-section">
        <div className="login-card">
          <Link href="/" className="login-card-brand">
            <span className="login-card-brand-icon">
              <HeartPulse size={32} />
            </span>
            <span className="login-card-brand-name">
              Ever<span>Care</span>
            </span>
          </Link>

          <div className="login-card-heading">
            <h2>Welcome Back</h2>
            <p>Log in to your account to continue.</p>
          </div>

          <form className="form-login" onSubmit={handleLogin}>
            <label htmlFor="login-email">Email Address</label>

            <div className="login-input-wrapper">
              <Mail size={20} aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="login-password">Password</label>

            <div className="login-input-wrapper">
              <LockKeyhole size={20} aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <label htmlFor="login-role">Sign in as</label>

            <select
              id="login-role"
              className="login-role-select"
              name="role"
              value={loginData.role}
              onChange={handleChange}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <span className="login-help-text">
                Need help signing in?
              </span>
            </div>

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="login-divider">
            <span />
            <p>OR</p>
            <span />
          </div>

          <p className="login-register-prompt">
            Don&apos;t have an account?{" "}
            <Link href="/register">Register</Link>
          </p>
        </div>

        <p className="login-footer-note">
          EverCare Healthcare Management System
        </p>
      </section>
    </main>
  );
}
