"use client";

import { useEffect, useState } from "react";
import DoctorsSidebar from "@/components/layouts/DoctorsSidebar";

interface Appointment {
  _id: string;
  status: string;
  date: string;
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const doctorId = localStorage.getItem("doctorId");
      const token = localStorage.getItem("token");

      if (!doctorId) return;

      const response = await fetch(
        `http://localhost:2000/api/doctors/appointments`,
        {
          headers:{
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      setAppointments(data.appointments || []);
    } catch (error) {
      console.log(error);
    }
  };

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (app) => app.status === "pending"
  ).length;

  const completedAppointments = appointments.filter(
    (app) => app.status === "completed"
  ).length;

  return (
    <section className="doctor-model">

      <DoctorsSidebar />

      <div id="doctor-model">

        <div className="p-hed">
          <h1>Welcome to Doctor Dashboard</h1>
        </div>

        <div className="patient-cards">

          <div className="patient-card">
            <h3>My Appointments</h3>
            <h2>{totalAppointments}</h2>
            <p>Total Appointments</p>
          </div>

          <div className="patient-card">
            <h3>Pending</h3>
            <h2>{pendingAppointments}</h2>
            <p>Pending Appointments</p>
          </div>

          <div className="patient-card">
            <h3>Completed</h3>
            <h2>{completedAppointments}</h2>
            <p>Completed Appointments</p>
          </div>

        </div>

      </div>

    </section>
  );
}
