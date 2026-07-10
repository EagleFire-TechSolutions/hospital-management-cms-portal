"use client";


import { useEffect, useState } from "react";

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

  return (
    <>
      <div id="container">
        <h1>My Appointments</h1>

        <div id="appointments-container">
          {appointments.length === 0 ? (
            <p>No Appointments Found</p>
          ) : (
            appointments.map((app) => (
              <div className="card" key={app._id}>
                <h3>
                  Doctor:{" "}
                  {app.doctorId
                    ? app.doctorId.name
                    : "Doctor not assigned"}
                </h3>

                <p>
                  Date:{" "}
                  {new Date(app.date).toLocaleDateString()}
                </p>

                <p>Time: {app.time}</p>

               <p>
  Status:
  <span className={`status ${app.status.toLowerCase()}`}>
    {app.status}
  </span>
</p>
              </div>
            ))
          )}
        </div>
      </div>

     
    </>
  );
}