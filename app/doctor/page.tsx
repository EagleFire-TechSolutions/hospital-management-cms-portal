"use client";


import { useEffect, useState } from "react";

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

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const doctorId = localStorage.getItem("doctorId");

      if (!doctorId) return;

      const response = await fetch(
        `http://localhost:2000/api/appointments/${doctorId}`
      );

      const data = await response.json();

      setAppointments(data.appointments || []);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("http://localhost:2000/api/appointments/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    loadAppointments();
  };

  const updateReport = async (id: string) => {
    await fetch("http://localhost:2000/api/appointments/reports", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        reports: reports[id],
      }),
    });

    loadAppointments();
  };

  return (
    <>
      <h1>Doctor Dashboard</h1>

      <div className="table-container">
        <table>
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
            {appointments.map((app) => (
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.age}</td>
                <td>{app.gender}</td>
                <td>{app.department}</td>
                <td>{app.date}</td>
                <td>{app.time}</td>
                <td>{app.status}</td>

                <td>
                  <button
                    onClick={() =>
                      updateStatus(app._id, "approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(app._id, "rejected")
                    }
                  >
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(app._id, "completed")
                    }
                  >
                    Done
                  </button>

                  <br />

                  <input
                    type="text"
                    placeholder="Report"
                    value={reports[app._id] || ""}
                    onChange={(e) =>
                      setReports({
                        ...reports,
                        [app._id]: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={() =>
                      updateReport(app._id)
                    }
                  >
                    Upload
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}