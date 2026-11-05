
"use client";

import Sidebar from "@/components/layouts/Sidebar";
import { useEffect, useState } from "react";
import "@/styles/patient.css";

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
    <Sidebar />

    <main id="book-appointment">
      <div className="booking-layout">

        {/* LEFT SIDE */}
        <section className="booking-intro">

          <div className="booking-brand">
            <div className="booking-brand-icon">+</div>
            <div>
              <h2>EverCare</h2>
              <span>HEALTHCARE SERVICES</span>
            </div>
          </div>

          <div className="booking-intro-content">
            <span className="booking-tag">YOUR HEALTH MATTERS</span>

            <h1>
              Book Your
              <span> Appointment</span>
              With Confidence.
            </h1>

            <p>
              Quality healthcare begins with the right appointment.
              Connect with our experienced doctors and take the
              next step towards a healthier life.
            </p>

            <div className="booking-image">
               <img
    src="/image/h.JPG.jpg"
    alt="Doctor representing EverCare healthcare services"
  />
            </div>

            <div className="booking-benefits">
              <div>
                <span>✓</span>
                <p>Experienced doctors</p>
              </div>
              <div>
                <span>✓</span>
                <p>Easy appointment booking</p>
              </div>
              <div>
                <span>✓</span>
                <p>Patient-focused care</p>
              </div>
            </div>
          </div>

          <p className="booking-copyright">
            © EverCare Healthcare Management System
          </p>

        </section>

        {/* RIGHT SIDE */}
        <section className="booking-form-area">

          <div className="booking-form-card">

            <div className="booking-form-heading">
              <span>BOOK AN APPOINTMENT</span>
              <h2>Schedule Your Visit</h2>
              <p>
                Please provide your details to request an appointment.
              </p>
            </div>

            <form className="book-form" onSubmit={handleBookAppointment}>

              <div className="booking-field">
                <label>Patient Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="booking-form-row">
                <div className="booking-field">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-field">
                  <label>Gender</label>
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
                </div>
              </div>

              <div className="booking-field">
                <label>Select Doctor</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose your doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="booking-field">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Nephrologist">Nephrologist</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Optomologist">Optomologist</option>
                  <option value="Diabatologist">Diabatologist</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrition">Pediatrition</option>
                </select>
              </div>

              <div className="booking-form-row">
                <div className="booking-field">
                  <label>Appointment Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="booking-field">
                  <label>Appointment Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="booking-submit">
                Confirm Appointment <span>→</span>
              </button>

              <p className="booking-form-note">
                Your appointment request will be submitted securely.
              </p>

            </form>
          </div>

        </section>
      </div>
    </main>
  </>
);


}
