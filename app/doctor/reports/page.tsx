
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
  report?: string;
  reportPublicId?: string;
}

export default function Reports() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<{
    [key: string]: File | null;
  }>({});

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
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      console.log("Appointments from backend:", data.appointments);
      setAppointments(data.appointments || []);
    } catch (error) {
      console.log(error);
    }
  };

  const updateReport = async (id: string) => {
    const file = reports[id];

    if (!file) {
      alert("Please select a report first.");
      return;
    }

    const formData = new FormData();
    formData.append("report", file);

    try {
      const response = await fetch(
        `http://localhost:2000/api/doctors/upload-report/${id}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Report uploaded successfully.");

        setReports({
          ...reports,
          [id]: null,
        });

        loadAppointments();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Karachi"
    });
  };

  const viewReport = async (reportName: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:2000/api/reports/doctor?reportName=${encodeURIComponent(reportName)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Unable to open report.");
        return;
      }

      window.open(data.reportUrl, "_blank");

    } catch (error) {
      console.error("Error viewing report:", error);
      alert("Unable to open report.");
    }
  };

  return (
    <section className="doctor-model reports-page">

      <DoctorsSidebar />

      <main id="doctor-model" className="reports-main">

        <div className="reports-content">

          <header className="reports-header">
            <div>
              <span className="reports-eyebrow">DOCTOR PORTAL</span>
              <h1>Medical Reports</h1>
              <p>Upload, manage and view medical reports for your patients.</p>
            </div>
          </header>

          <section className="reports-summary">

            <div className="reports-summary-icon">▤</div>

            <div>
              <p>Total Appointments</p>
              <h2>{appointments.length}</h2>
              <span>Patient records</span>
            </div>

          </section>

          <section className="reports-table-section">

            <div className="reports-table-heading">
              <div>
                <h2>Patient Reports</h2>
                <p>Manage medical documents for your appointments.</p>
              </div>

              <span className="reports-count">
                {appointments.length} Records
              </span>
            </div>

            <div className="reports-table-wrapper">

              <table className="reports-table">

                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Department</th>
                    <th>Appointment Date</th>
                    <th>Status</th>
                    <th>Medical Report</th>
                  </tr>
                </thead>

                <tbody>

                  {appointments.length === 0 ? (

                    <tr>
                      <td colSpan={7} className="reports-empty">
                        No appointments found.
                      </td>
                    </tr>

                  ) : (

                    appointments.map((app) => (

                      <tr key={app._id}>

                        <td>
                          <div className="reports-patient-cell">
                            <div className="reports-patient-avatar">
                              {app.name.charAt(0).toUpperCase()}
                            </div>
                            <strong>{app.name}</strong>
                          </div>
                        </td>

                        <td>{app.age}</td>
                        <td>{app.gender}</td>
                        <td>{app.department}</td>
                        <td>{formDate(app.date)}</td>

                        <td>
                          <span className={`reports-status ${app.status}`}>
                            {app.status}
                          </span>
                        </td>

                        <td className="reports-action-cell">

                          {app.report || app.reportPublicId ? (

                            <button
                              onClick={() => viewReport(app.report || app.reportPublicId!)}
                              className="reports-view-btn"
                            >
                              View Report
                            </button>

                          ) : app.status === "rejected" ? (

                            <span className="reports-disabled">
                              Not available
                            </span>

                          ) : (

                            <div className="reports-upload-area">

                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];

                                  if (!file) return;

                                  const allowedTypes = [
                                    "application/pdf",
                                    "image/jpeg",
                                    "image/png",
                                  ];

                                  if (!allowedTypes.includes(file.type)) {
                                    alert("Invalid file type. Only PDF, JPEG, and PNG files are allowed.");
                                    e.target.value = "";
                                    return;
                                  }

                                  if (file.size > 5 * 1024 * 1024) {
                                    alert("File size must not exceed 5 MB.");
                                    e.target.value = "";
                                    return;
                                  }

                                  setReports({
                                    ...reports,
                                    [app._id]: file,
                                  });
                                }}
                              />

                              <button
                                className="reports-upload-btn"
                                onClick={() => updateReport(app._id)}
                              >
                                Upload
                              </button>

                            </div>

                          )}

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
