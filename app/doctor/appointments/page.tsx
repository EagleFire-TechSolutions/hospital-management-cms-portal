
"use client";

import { useEffect, useState } from "react";
import DoctorsSidebar from "@/components/layouts/DoctorsSidebar";

interface Appointment {
  _id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  date: string;
  time: string;
  status: string;
}

export default function MyAppointments() {
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
        "http://localhost:2000/api/doctors/appointments",
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

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("http://localhost:2000/api/doctors/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id, status }),
      });

      loadAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const formDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Karachi",
    });

  const formTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const total = appointments.length;
  const pending = appointments.filter(
    (app) => app.status.toLowerCase() === "pending"
  ).length;
  const approved = appointments.filter(
    (app) => app.status.toLowerCase() === "approved"
  ).length;
  const rejected = appointments.filter(
    (app) => app.status.toLowerCase() === "rejected"
  ).length;

  return (
    <section className="doctor-model appointments-page">
      <DoctorsSidebar />

      <div id="doctor-model" className="appointments-main">
        <header className="appointments-topbar">
          <div className="appointments-breadcrumb">
            <span className="appointments-breadcrumb-dot" />
            Doctor Workspace
          </div>
          <div className="appointments-topbar-label">
            <span className="appointments-online-dot" />
            Appointment Management
          </div>
        </header>

        <main className="appointments-content">
          <section className="appointments-heading">
            <div>
              <span className="appointments-eyebrow">YOUR SCHEDULE</span>
              <h1>My Appointments</h1>
              <p>
                Manage your patient appointments and keep track of your
                schedule.
              </p>
            </div>

            <div className="appointments-date-card">
              <span className="appointments-date-icon">▦</span>
              <div>
                <small>Today</small>
                <strong>
                  {new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Karachi",
                  })}
                </strong>
              </div>
            </div>
          </section>

          <section className="appointments-stats">
            <article className="appointment-stat-card stat-total">
              <div className="appointment-stat-icon">▦</div>
              <div className="appointment-stat-info">
                <span>Total Appointments</span>
                <strong>{total}</strong>
                <small>All appointments in your list</small>
              </div>
            </article>

            <article className="appointment-stat-card stat-pending">
              <div className="appointment-stat-icon">◷</div>
              <div className="appointment-stat-info">
                <span>Pending</span>
                <strong>{pending}</strong>
                <small>Awaiting a decision</small>
              </div>
            </article>

            <article className="appointment-stat-card stat-approved">
              <div className="appointment-stat-icon">✓</div>
              <div className="appointment-stat-info">
                <span>Approved</span>
                <strong>{approved}</strong>
                <small>Approved appointments</small>
              </div>
            </article>

            <article className="appointment-stat-card stat-rejected">
              <div className="appointment-stat-icon">×</div>
              <div className="appointment-stat-info">
                <span>Rejected</span>
                <strong>{rejected}</strong>
                <small>Rejected appointments</small>
              </div>
            </article>
          </section>

          <section className="appointments-table-card">
            <div className="appointments-table-heading">
              <div>
                <span className="appointments-section-kicker">
                  PATIENT SCHEDULE
                </span>
                <h2>Appointment Records</h2>
                <p>Review patient details and update appointment status.</p>
              </div>

              <button
                type="button"
                className="appointments-refresh-btn"
                onClick={loadAppointments}
              >
                <span>↻</span> Refresh
              </button>
            </div>

            <div className="appointments-table-scroll">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="appointments-empty">
                        <div className="appointments-empty-icon">▦</div>
                        <strong>No appointments found</strong>
                        <span>
                          Your patient appointments will appear here.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <div className="appointment-patient">
                            <div className="appointment-patient-avatar">
                              {app.name?.charAt(0)?.toUpperCase() || "P"}
                            </div>
                            <strong>{app.name}</strong>
                          </div>
                        </td>
                        <td>{app.age}</td>
                        <td>{app.gender}</td>
                        <td>
                          <span className="appointment-department">
                            {app.department}
                          </span>
                        </td>
                        <td className="appointment-date">
                          {formDate(app.date)}
                        </td>
                        <td className="appointment-time">
                          {formTime(app.time)}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${app.status.toLowerCase()}`}
                          >
                            <span className="status-badge-dot" />
                            {app.status}
                          </span>
                        </td>
                        <td>
                          <div className="appointment-actions">
                            <button
                              type="button"
                              className="appointment-action-btn approve-btn"
                              onClick={() =>
                                updateStatus(app._id, "approved")
                              }
                              title="Approve appointment"
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              className="appointment-action-btn reject-btn"
                              onClick={() =>
                                updateStatus(app._id, "rejected")
                              }
                              title="Reject appointment"
                            >
                              Reject
                            </button>

                            <button
                              type="button"
                              className="appointment-action-btn done-btn"
                              onClick={() =>
                                updateStatus(app._id, "completed")
                              }
                              title="Mark as completed"
                            >
                              Done
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>


<footer className="appointments-table-footer">
  <div className="appointments-footer-info">
    <strong>Appointment Overview</strong>
    <span>
      Showing {appointments.length}{" "}
      {appointments.length === 1 ? "appointment" : "appointments"}
    </span>
  </div>

  <div className="appointments-footer-note">
    <strong>EverCare HMS</strong>
    <span>Organizing appointments, supporting doctors, improving patient care.</span>
  </div>


</footer>

          </section>


<section className="appointments-bottom-section">
  <div className="appointments-bottom-card">
    <div className="appointments-bottom-icon">♡</div>
    <div>
      <h3>Patient Care Comes First</h3>
      <p>
        Keep your appointment records updated to provide
        patients with a smooth healthcare experience.
      </p>
    </div>
  </div>

  <div className="appointments-bottom-card">
    <div className="appointments-bottom-icon">✓</div>
    <div>
      <h3>Stay Organized</h3>
      <p>
        Review pending appointments and update their status
        regularly to manage your schedule efficiently.
      </p>
    </div>
  </div>
</section>

        </main>
      </div>
    </section>
  );
}
