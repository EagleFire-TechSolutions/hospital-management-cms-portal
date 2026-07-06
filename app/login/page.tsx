"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "patient",
  });

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

      if (data.success) {
        alert("Login Successful");

        localStorage.setItem(
          "token",
          data.data.AccessTokens || ""
        );

        if (loginData.role === "doctor") {
          localStorage.setItem(
            "doctorId",
            data.data.id || ""
          );

          router.push("/doctor");
        } else {
          localStorage.setItem(
            "patientId",
            data.data.id || ""
          );

          router.push("/patient");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="login-form">
      <h1>Please Login From Here</h1>

      <form className="form-login" onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={loginData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={loginData.role}
          onChange={handleChange}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button type="submit">
          Login User
        </button>
      </form>
    </div>
  );
}