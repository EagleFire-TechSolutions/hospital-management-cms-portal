
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DoctorsSidebar from "@/components/layouts/DoctorsSidebar";
import DoctorChart from "@/components/charts/doctorchrat";
import "../../styles/doctor.css";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Bell,
  UserRound,
  FileText,
  Users,
  ArrowRight,
  Activity,
  Stethoscope,
} from "lucide-react";

interface Appointment {
  _id: string;
  status: string;
  date: string;
  patientName?: string;
  patientId?: string;
  reason?: string;
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (role && role !== "doctor") {
      window.location.href = "/login";
      return;
    }

    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const doctorId = localStorage.getItem("doctorId");
      const token = localStorage.getItem("token");

      if (!doctorId || !token) return;

      const response = await fetch(
        "http://localhost:2000/api/doctors/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load appointments.");
      }

      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (app) => app.status?.toLowerCase() === "pending"
  ).length;

  const completedAppointments = appointments.filter(
    (app) => app.status?.toLowerCase() === "completed"
  ).length;

  const cancelledAppointments = appointments.filter((app) => {
    const status = app.status?.toLowerCase();
    return status === "cancelled" || status === "rejected";
  }).length;

  const filteredAppointments = appointments.filter((app) => {
    const query = search.toLowerCase();

    return (
      (app.patientName || "").toLowerCase().includes(query) ||
      (app.reason || "").toLowerCase().includes(query) ||
      app.status.toLowerCase().includes(query)
    );
  });

  const upcomingAppointments = [...appointments]
    .filter((app) => {
      const status = app.status?.toLowerCase();
      return status !== "completed" &&
        status !== "cancelled" &&
        status !== "rejected";
    })
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    .slice(0, 4);

  const formatDate = (date: string) => {
    const parsed = new Date(date);

    if (!date || Number.isNaN(parsed.getTime())) {
      return "Date unavailable";
    }

    return parsed.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    const parsed = new Date(date);

    if (!date || Number.isNaN(parsed.getTime())) {
      return "--:--";
    }

    return parsed.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const doctorName =
    typeof window !== "undefined"
      ? localStorage.getItem("doctorName") || "Doctor"
      : "Doctor";

  const statusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "doctor-status doctor-status-completed";
      case "pending":
        return "doctor-status doctor-status-pending";
      case "approved":
      case "confirmed":
        return "doctor-status doctor-status-confirmed";
      case "cancelled":
      case "rejected":
        return "doctor-status doctor-status-cancelled";
      default:
        return "doctor-status doctor-status-default";
    }
  };

  return (
    <section className="doctor-model">
      <DoctorsSidebar />

      <main id="doctor-model" className="doctor-dashboard">
        {/* TOP BAR */}
        <header className="doctor-topbar">
          <div className="doctor-search">
            <Search size={19} />
            <input
              type="search"
              placeholder="Search appointments..."
              aria-label="Search appointments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="doctor-topbar-profile">
            <button
              type="button"
              className="doctor-notification"
              aria-label="Notifications"
            >
              <Bell size={21} />
            </button>

            <div className="doctor-avatar">
              <Stethoscope size={22} />
            </div>

            <div className="doctor-profile-text">
              <strong>{doctorName}</strong>
              <span>Medical Professional</span>
            </div>
          </div>
        </header>

        {/* WELCOME BANNER */}
        <section className="doctor-welcome-banner">
          <div className="doctor-welcome-content">
            <span className="doctor-eyebrow">
              YOUR HEALTHCARE WORKSPACE
            </span>

            <h1>
              Welcome back,
              <span> {doctorName}</span>
            </h1>

            <p>
              Stay organized, review your appointments, and
              manage your patient care.
            </p>

            <div className="doctor-welcome-details">
              <div>
                <CalendarDays size={20} />
                <span>
                  <small>Today</small>
                  {new Date().toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div>
                <Activity size={20} />
                <span>
                  <small>Total Appointments</small>
                  {loading ? "Loading..." : totalAppointments}
                </span>
              </div>
            </div>
          </div>

          <div className="doctor-welcome-art" aria-hidden="true">
            <div className="doctor-art-circle">
              <Stethoscope size={85} strokeWidth={1.2} />
            </div>
            <p>
              Better Care.
              <span>A Healthier Tomorrow.</span>
            </p>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="doctor-stats-grid">
          <article className="doctor-stat-card">
            <div className="doctor-stat-icon stat-blue">
              <CalendarDays size={24} />
            </div>
            <div className="doctor-stat-info">
              <p>My Appointments</p>
              <h2>{loading ? "—" : totalAppointments}</h2>
              <span>Total appointments</span>
            </div>
          </article>

          <article className="doctor-stat-card">
            <div className="doctor-stat-icon stat-green">
              <Clock size={24} />
            </div>
            <div className="doctor-stat-info">
              <p>Pending</p>
              <h2>{loading ? "—" : pendingAppointments}</h2>
              <span>Awaiting action</span>
            </div>
          </article>

          <article className="doctor-stat-card">
            <div className="doctor-stat-icon stat-purple">
              <CheckCircle size={24} />
            </div>
            <div className="doctor-stat-info">
              <p>Completed</p>
              <h2>{loading ? "—" : completedAppointments}</h2>
              <span>Completed appointments</span>
            </div>
          </article>

          <article className="doctor-stat-card">
            <div className="doctor-stat-icon stat-red">
              <XCircle size={24} />
            </div>
            <div className="doctor-stat-info">
              <p>Cancelled / Rejected</p>
              <h2>{loading ? "—" : cancelledAppointments}</h2>
              <span>Not proceeding</span>
            </div>
          </article>
        </section>

        {/* APPOINTMENTS AND UPCOMING SCHEDULE */}
        <section className="doctor-dashboard-grid">
          <div className="doctor-main-column">
            <section className="doctor-panel">
              <div className="doctor-panel-heading">
                <div>
                  <CalendarDays size={20} />
                  <h2>My Appointments</h2>
                </div>
                <span className="doctor-panel-count">
                  {filteredAppointments.length} records
                </span>
              </div>

              <div className="doctor-table-wrapper">
                <table className="doctor-appointments-table">
                  <thead>
                    <tr>
                      <th>Date &amp; Time</th>
                      <th>Patient</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="doctor-empty-state">
                          Loading appointments...
                        </td>
                      </tr>
                    ) : filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="doctor-empty-state">
                          {search
                            ? "No matching appointments found."
                            : "No appointments available yet."}
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.slice(0, 8).map((app) => (
                        <tr key={app._id}>
                          <td>
                            <strong>{formatTime(app.date)}</strong>
                            <small>{formatDate(app.date)}</small>
                          </td>

                          <td>
                            <div className="doctor-patient-cell">
                              <span className="doctor-patient-avatar">
                                <UserRound size={17} />
                              </span>
                              <span>
                                <strong>
                                  {app.patientName || "Patient"}
                                </strong>
                                <small>
                                  {app.patientId || "Appointment"}
                                </small>
                              </span>
                            </div>
                          </td>

                          <td>{app.reason || "Consultation"}</td>

                          <td>
                            <span className={statusClass(app.status)}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="doctor-panel-footer">
                <span>
                  Showing {Math.min(filteredAppointments.length, 8)} of{" "}
                  {filteredAppointments.length} appointments
                </span>
              </div>
            </section>

            {/* EXISTING DOCTOR CHART */}
            <section className="doctor-panel doctor-chart-panel">
              <div className="doctor-panel-heading">
                <div>
                  <Activity size={20} />
                  <h2>Appointment Overview</h2>
                </div>
              </div>

              <div className="doctor-chart">
                <DoctorChart />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="doctor-side-column">
            <section className="doctor-panel">
              <div className="doctor-panel-heading">
                <div>
                  <CalendarDays size={20} />
                  <h2>Upcoming Appointments</h2>
                </div>
              </div>

              {loading ? (
                <p className="doctor-upcoming-empty">
                  Loading schedule...
                </p>
              ) : upcomingAppointments.length === 0 ? (
                <p className="doctor-upcoming-empty">
                  No upcoming appointments found.
                </p>
              ) : (
                <div className="doctor-upcoming-list">
                  {upcomingAppointments.map((app) => (
                    <article className="doctor-upcoming-item" key={app._id}>
                      <div className="doctor-upcoming-time">
                        {formatTime(app.date)}
                        <small>{formatDate(app.date)}</small>
                      </div>

                      <div className="doctor-upcoming-details">
                        <strong>{app.patientName || "Patient"}</strong>
                        <span>{app.reason || "Consultation"}</span>
                      </div>

                      <span className={statusClass(app.status)}>
                        {app.status}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* QUICK ACTIONS */}
            <section className="doctor-panel doctor-quick-actions">
              <div className="doctor-panel-heading">
                <div>
                  <Activity size={20} />
                  <h2>Quick Actions</h2>
                </div>
              </div>

              <div className="doctor-actions-grid">
                <Link
                  href="/doctor/appointments"
                  className="doctor-action-link action-green"
                >
                  <CalendarDays size={20} />
                  <span>Appointments</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/doctor/patients"
                  className="doctor-action-link action-blue"
                >
                  <Users size={20} />
                  <span>View Patients</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/doctor/reports"
                  className="doctor-action-link action-purple"
                >
                  <FileText size={20} />
                  <span>View Reports</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/doctor/profile"
                  className="doctor-action-link action-teal"
                >
                  <UserRound size={20} />
                  <span>My Profile</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            <section className="doctor-care-note">
              <div>
                <CheckCircle size={27} />
              </div>
              <p>
                <strong>Your expertise makes a difference.</strong>
                <span>Thank you for caring for your patients.</span>
              </p>
            </section>
          </aside>
        </section>


<footer className="doctor-dashboard-footer">
  <div className="footer-content">
    <div className="footer-brand">
      <h3>EverCare</h3>
      <p>Healthcare Management System</p>
      <span>Supporting better healthcare through technology.</span>
    </div>

    <div className="footer-info">
      <h4>Doctor Portal</h4>
      <p>Manage appointments</p>
      <p>View patient records</p>
      <p>Manage medical reports</p>
    </div>

    <div className="footer-contact">
      <h4>Our Commitment</h4>
      <p>Patient-centered care</p>
      <p>Secure health information</p>
      <p>Efficient healthcare services</p>
    </div>
  </div>

  <div className="footer-bottom">
    <span>© {new Date().getFullYear()} EverCare. All rights reserved.</span>
    <span>Care with compassion. Healing with excellence.</span>
  </div>
</footer>

      </main>
    </section>
  );
}
