"use client";

import { useEffect, useState } from "react";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
}

export default function BookAppointment() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    doctorId: "",
    department: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    try {
      const response = await fetch(
        "http://localhost:2000/api/doctors/AllDoctors"
      );

      const data = await response.json();

      setDoctors(data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookAppointment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:2000/api/appointment/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (data.success) {
        setFormData({
          name: "",
          age: "",
          gender: "",
          doctorId: "",
          department: "",
          date: "",
          time: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div id="book">
        <img
          className="img-b"
          src="/b.webp"
          alt="Book Appointment"
        />
      </div>

      <div id="book-appointment">
        <div className="hed">
          <h1>Book Appointment</h1>
        </div>

        <form className="book-form" onSubmit={handleBookAppointment}>

          <input
            type="text"
            name="name"
            placeholder="Patient Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Patient Age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Automatic Doctor List */}
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            

            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} ({doctor.specialization})
              </option>
            ))}
          </select>

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>

          <label>Appointment Date</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>Appointment Time</label>

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Book Appointment
          </button>

        </form>
      </div>
    </>
  );
}