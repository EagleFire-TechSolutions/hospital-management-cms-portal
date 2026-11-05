
"use client";

import Sidebar from "@/components/layouts/Sidebar";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  UserRound,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";

interface Appointment {
  _id: string;
  doctorId: {
    name: string;
  };
  date: string;
  time: string;
  status: string;
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const response = await fetch(
        "http://localhost:2000/api/appointment/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setAppointments(data.appointments || []);
    } catch (error) {
      console.log(error);
    }
  };

  const formTime = (time: string) => {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Sidebar />

      <main className="my-appointments-page">
        <div className="appointments-content">

          {/* Page Heading */}
          <header className="appointments-header">
            <div>
              <span className="appointments-eyebrow">
                PATIENT PORTAL
              </span>
              <h1>My Appointments</h1>
              <p>
                View and manage your scheduled healthcare visits.
              </p>
            </div>

            <div className="appointments-header-icon">
              <CalendarCheck size={34} />
            </div>
          </header>

          {/* Appointment Summary */}
          <section className="appointments-summary">
            <div className="appointments-summary-icon">
              <CalendarDays size={25} />
            </div>

            <div>
              <h3>{appointments.length}</h3>
              <p>Total Appointments</p>
            </div>
          </section>

          {/* Appointment List */}
          <section className="appointments-list-section">
            <div className="appointments-section-heading">
              <div>
                <span className="appointments-eyebrow">
                  YOUR HEALTHCARE
                </span>
                <h2>Appointment History</h2>
              </div>

              <span className="appointments-count">
                {appointments.length} Records
              </span>
            </div>

            {appointments.length === 0 ? (
              <div className="appointments-empty">
                <div className="appointments-empty-icon">
                  <CalendarDays size={35} />
                </div>
                <h3>No Appointments Yet</h3>
                <p>
                  Your booked appointments will appear here.
                </p>
              </div>
            ) : (
              <div className="appointments-grid">
                {appointments.map((app) => (
                  <article className="appointment-card" key={app._id}>

                    <div className="appointment-card-top">
                      <div className="appointment-doctor-icon">
                        <UserRound size={23} />
                      </div>

                      <span
                        className={`status ${app.status.toLowerCase()}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="appointment-doctor">
                      <span>APPOINTMENT WITH</span>
                      <h3>
                        {app.doctorId
                          ? app.doctorId.name
                          : "Doctor not assigned"}
                      </h3>
                    </div>

                    <div className="appointment-details">
                      <div>
                        <CalendarDays size={18} />
                        <div>
                          <span>Appointment Date</span>
                          <p>
                            {new Date(app.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Clock size={18} />
                        <div>
                          <span>Appointment Time</span>
                          <p>{formTime(app.time)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="appointment-card-footer">
                      <ClipboardList size={16} />
                      <span>EverCare Healthcare Services</span>
                    </div>

                  </article>
                ))}
              </div>
            )}
          </section>

        {/* Footer */}
<footer className="appointments-footer">
  <div className="footer-content">
    <div className="footer-brand">
      <h3>EverCare</h3>
      <p>Healthcare Management System</p>
    </div>

    <div className="footer-tagline">
      <span className="footer-line"></span>
      <p>Care with compassion.</p>
    </div>
  </div>

  <div className="footer-bottom">
    <span>© {new Date().getFullYear()} EverCare. All rights reserved.</span>
    <span>Designed for better healthcare.</span>
  </div>
</footer>

        </div>
      </main>
    </>
  );
}
