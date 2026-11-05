
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/doctor.css";
import { Menu, X, LayoutDashboard, CalendarDays, Users, FileText, LogOut } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const [doctorName, setDoctorName] = useState("");
  const [doctorRole, setDoctorRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setDoctorName(localStorage.getItem("doctorName") || "");
    setDoctorRole(localStorage.getItem("role") || "Doctor");

    // Sidebar opens by default on desktop
    setIsOpen(window.innerWidth > 768);
  }, []);

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
        localStorage.removeItem("doctorId");
        localStorage.removeItem("doctorName");
        localStorage.removeItem("role");

        router.push("/login");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="sidebar-brand">
          <img src="/image/1.jpg" alt="EverCare Logo" />
          <div>
            <h2>EverCare</h2>
            <span>Doctor Portal</span>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {doctorName ? doctorName.charAt(0).toUpperCase() : "D"}
          </div>
          <div className="sidebar-profile-info">
            <h4>{doctorName || "Doctor"}</h4>
            <p>{doctorRole}</p>
          </div>
        </div>

        <p className="sidebar-label">MAIN MENU</p>

        <nav className="nav">
          <Link href="/doctor" onClick={() => setIsOpen(false)}>
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </Link>

          <Link href="/doctor/appointments" onClick={() => setIsOpen(false)}>
            <CalendarDays size={19} />
            <span>My Appointments</span>
          </Link>

          <Link href="/doctor/patients" onClick={() => setIsOpen(false)}>
            <Users size={19} />
            <span>My Patients</span>
          </Link>

          <Link href="/doctor/reports" onClick={() => setIsOpen(false)}>
            <FileText size={19} />
            <span>Reports</span>
          </Link>
        </nav>

        <button className="logout" onClick={handleLogout}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
