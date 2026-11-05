
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import "@/styles/patient.css";
import PatientChart from "@/components/charts/charts";
import {
  CalendarDays,
  FileText,
  CheckCircle,
  HeartPulse,
  Clock,
} from "lucide-react";

interface Appointment {
  _id: string;
  date: string;
}

interface Report {
  _id: string;
}

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [upcomingDate, setUpcomingDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    getAppointments();
    getReports();
  }, []);

  // ================= Get Appointments =================

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:2000/api/appointment/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      const apps = data.appointments || [];

      setAppointments(apps);

      if (apps.length > 0) {
        const sortedAppointments = apps.sort(
          (a: Appointment, b: Appointment) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
        );

        setUpcomingDate(
          new Date(sortedAppointments[0].date).toLocaleDateString()
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= Get Reports =================

  const getReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:2000/api/appointment/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setReports(data.reports || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Sidebar />

      <section className="patient-model">
        <main id="patient-model">

          {/* Dashboard Header */}
          <header className="patient-dashboard-header">
            <div className="patient-header-text">
              <p className="patient-eyebrow">PATIENT PORTAL</p>
              <h1>Welcome to Your Dashboard</h1>
              <p>
                Manage your appointments and keep track of your health.
              </p>
            </div>

            <div className="patient-health-banner">
              <div className="patient-health-icon">
                <HeartPulse size={32} />
              </div>
              <div>
                <h3>Your Health</h3>
                <h3>Our Priority</h3>
                <span></span>
              </div>
            </div>
          </header>

          {/* Summary Cards */}
          <section className="patient-cards">

            <div className="patient-card">
              <div className="patient-card-icon appointments-icon">
                <CalendarDays size={27} />
              </div>

              <div className="patient-card-info">
                <h3>My Appointments</h3>
                <h2>{appointments.length}</h2>
                <p>Total appointments</p>
              </div>
            </div>

            <div className="patient-card">
              <div className="patient-card-icon reports-icon">
                <FileText size={27} />
              </div>

              <div className="patient-card-info">
                <h3>Medical Reports</h3>
                <h2>{reports.length}</h2>
                <p>Available reports</p>
              </div>
            </div>

            <div className="patient-card">
              <div className="patient-card-icon upcoming-icon">
                <CheckCircle size={27} />
              </div>

              <div className="patient-card-info">
                <h3>Upcoming Visit</h3>
                <h2 className="patient-upcoming-date">
                  {upcomingDate || "No Visit"}
                </h2>
                <p>Next appointment date</p>
              </div>
            </div>

          </section>

          {/* Dashboard Content */}
          <section className="patient-dashboard-grid">

            {/* Pie Chart */}
            <div className="patient-chart-section">
              <div className="patient-section-heading">
                <div>
                  <p className="patient-eyebrow">HEALTH OVERVIEW</p>
                  <h2>Your Activity</h2>
                  <p>View your health and appointment activity.</p>
                </div>

                <div className="patient-chart-icon">
                  <Clock size={23} />
                </div>
              </div>

              <div className="patient-chart">
                <PatientChart />
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="patient-upcoming-section">
              <div className="patient-section-heading">
                <h2>
                  <CalendarDays size={21} />
                  Upcoming Appointments
                </h2>
              </div>

              {appointments.length > 0 ? (
                <div className="patient-appointment-list">
                  {appointments
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() -
                        new Date(b.date).getTime()
                    )
                    .slice(0, 4)
                    .map((appointment) => (
                      <div
                        className="patient-appointment-item"
                        key={appointment._id}
                      >
                        <div>
                          <h4>
                            {new Date(
                              appointment.date
                            ).toLocaleDateString()}
                          </h4>
                          <p>Appointment</p>
                        </div>

                        <span className="patient-appointment-status">
                          Scheduled
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="patient-empty">
                  <CalendarDays size={30} />
                  <p>No appointments available.</p>
                </div>
              )}
            </div>

          </section>

          {/* Health Reminder */}
          <section className="patient-health-reminder">
            <div className="patient-reminder-icon">
              <HeartPulse size={27} />
            </div>

            <div>
              <h3>Stay Healthy, Stay Strong</h3>
              <p>
                Regular checkups and timely care make a difference.
              </p>
            </div>
          </section>

          {/* Footer */}

<footer className="patient-dashboard-footer">
  <div className="patient-footer-content">
    <div>
      <h3>EverCare</h3>
      <p>Healthcare Management System</p>
      <span>Your health, our priority.</span>
    </div>

    <div>
      <h4>Patient Services</h4>
      <p>Book appointments</p>
      <p>View medical reports</p>
      <p>Manage your health records</p>
    </div>

    <div>
      <h4>Our Commitment</h4>
      <p>Compassionate patient care</p>
      <p>Secure health information</p>
      <p>Accessible healthcare services</p>
    </div>
  </div>

  <div className="patient-footer-bottom">
    <span>© {new Date().getFullYear()} EverCare. All rights reserved.</span>
    <span>Care with compassion. Healing with excellence.</span>
  </div>
</footer>


        </main>
      </section>
    </>
  );
}
