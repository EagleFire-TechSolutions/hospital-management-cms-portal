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

                <p>Status: {app.status}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <footer>
        <div className="footer">
          <div id="footer-con1">
            <div id="footer-con">
              <h4 className="foo-h4">Address:</h4>

              <p>Main Mansehra Road, Mandian Abbottabad.</p>

              <h4>Phone:</h4>

              <p>0992-9311155</p>

              <h4>Website:</h4>

              <p>https://ath.gov.pk</p>

              <div id="links">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>

                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pinterest
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </div>
            </div>

            <div id="he">
              <h1>Let Us On Facebook</h1>
            </div>

            <iframe
              id="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.9781821674273!2d28.106799474208053!3d-26.32720596899264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9504cd09fe4d5b%3A0x99641770cb5757e1!2s8%20Jenny%20St%2C%20Brackenhurst%2C%20Alberton%2C%201448%2C%20South%20Africa!5e0!3m2!1sen!2s!4v1756017099188!5m2!1sen!2s"
              width="400"
              height="300"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </footer>
    </>
  );
}