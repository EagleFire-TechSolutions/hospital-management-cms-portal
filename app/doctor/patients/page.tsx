
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

export default function MyPatients() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const doctorId = localStorage.getItem("doctorId");
      const token = localStorage.getItem("token");

      if (!doctorId) return;

      const response = await fetch(
        `http://localhost:2000/api/doctors/appointments`,
        {
          headers: {
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

  // Get unique patients
  const patients = Array.from(
    new Map(
      appointments.map((appointment) => [
        appointment.name,
        appointment,
      ])
    ).values()
  );

  const formDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Karachi"
    });
  };

  return (
    <section className="doctor-model patients-page">

      <DoctorsSidebar />

      <main id="doctor-model" className="patients-main">

        <div className="patients-content">

          <header className="patients-header">
            <div>
              <span className="patients-eyebrow">DOCTOR PORTAL</span>
              <h1>My Patients</h1>
              <p>Manage and view patients who have appointments with you.</p>
            </div>
          </header>

          <section className="patients-summary">
            <div className="patients-summary-icon">♙</div>
            <div>
              <p>Total Patients</p>
              <h2>{patients.length}</h2>
              <span>Patients assigned to you</span>
            </div>
          </section>

          <section className="patients-table-section">

            <div className="patients-table-heading">
              <div>
                <h2>Patient Directory</h2>
                <p>Overview of your patients and their latest appointments.</p>
              </div>

              <span className="patients-count">
                {patients.length} Patients
              </span>
            </div>

            <div className="patients-table-wrapper">
              <table className="patients-table">

                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Department</th>
                    <th>Last Appointment</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="patients-empty">
                        No patients found.
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient._id}>
                        <td>
                          <div className="patient-name-cell">
                            <div className="patient-initial">
                              {patient.name.charAt(0).toUpperCase()}
                            </div>
                            <strong>{patient.name}</strong>
                          </div>
                        </td>

                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.department}</td>
                        <td>{formDate(patient.date)}</td>

                        <td>
                          <span className={`patients-status ${patient.status.toLowerCase()}`}>
                            {patient.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

          </section>

        </div>

      </main>

    </section>
  );
}
