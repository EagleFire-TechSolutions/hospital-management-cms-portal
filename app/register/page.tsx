"use client";


import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
    contact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

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

      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="login-form">
      <h1>Please Register From Here</h1>

      <form className="form-login" onSubmit={handleSubmit}>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        {formData.role === "doctor" && (
          <div>
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
            />

            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit">
          Register User
        </button>

        <div id="message"></div>
      </form>
    </div>
  );
}