
"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  FileText,
  LogOut,
  HeartPulse,
  UserRound,
} from "lucide-react";
const subscribe = () => () => {};

const getPatientName = () =>
  localStorage.getItem("patientName") || "";

const getPatientRole = () =>
  localStorage.getItem("role") || "Patient";

const getServerPatientName = () => "";
const getServerPatientRole = () => "Patient";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

 const patientName = useSyncExternalStore(
  subscribe,
  getPatientName,
  getServerPatientName
);

const patientRole = useSyncExternalStore(
  subscribe,
  getPatientRole,
  getServerPatientRole
);
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   setPatientName(localStorage.getItem("patientName") || "");
  //   setPatientRole(localStorage.getItem("role") || "Patient");
  // }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:2000/api/patient/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("patientId");
        localStorage.removeItem("patientName");
        localStorage.removeItem("role");

        router.push("/login");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="patient-sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={56} /> : <Menu size={56} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="patient-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`patient-sidebar ${
          isOpen ? "patient-sidebar-open" : ""
        }`}
      >
        {/* Brand */}
        <div className="patient-sidebar-brand">
          <div className="patient-brand-icon">
            <HeartPulse size={27} />
          </div>

          <div>
            <h2>EverCare</h2>
            <span>HEALTHCARE PORTAL</span>
          </div>
        </div>

        {/* Profile */}
        <div className="patient-sidebar-profile">
          <div className="patient-profile-avatar">
            <UserRound size={25} />
          </div>

          <div className="patient-profile-info">
            <h3>{patientName || "Patient"}</h3>
            <p>{patientRole || "Patient"}</p>
          </div>
        </div>

        {/* Navigation */}
        <p className="patient-sidebar-label">MAIN MENU</p>

        <nav className="patient-sidebar-nav">
          <Link
            href="/patient"
            onClick={closeSidebar}
            className={pathname === "/patient" ? "active" : ""}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/patient/book-appointment"
            onClick={closeSidebar}
            className={
              pathname === "/patient/book-appointment" ? "active" : ""
            }
          >
            <CalendarPlus size={19} />
            <span>Book Appointment</span>
          </Link>

          <Link
            href="/patient/view-appointments"
            onClick={closeSidebar}
            className={
              pathname === "/patient/view-appointments" ? "active" : ""
            }
          >
            <CalendarDays size={19} />
            <span>My Appointments</span>
          </Link>

          <Link
            href="/patient/reports"
            onClick={closeSidebar}
            className={pathname === "/patient/reports" ? "active" : ""}
          >
            <FileText size={19} />
            <span>My Reports</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="patient-sidebar-bottom">
          <button
            className="patient-sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

          <p>EverCare Healthcare Management System</p>
        </div>
      </aside>
    </>
  );
}
