"use client";

import { useEffect, useState } from "react";

interface Report {
  _id: string;
  doctorId?: {
    name: string;
  };
  reports: string;
  date: string;
}

export default function MyReports() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
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

      setReports(data.appointments || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="My-Reports">
      <div className="hed">
        <h1>My Medical Reports</h1>

        <div id="reports-container">
          {reports.length === 0 ? (
            <p>No Reports Available</p>
          ) : (
            reports.map((report) => (
              <div className="card" key={report._id}>
                <h3>
                  Doctor:{" "}
                  {report.doctorId
                    ? report.doctorId.name
                    : "Not Assigned"}
                </h3>

                <p>
                  Report:{" "}
                  {report.reports || "No Report Uploaded"}
                </p>

                <p>
                  Date:{" "}
                  {new Date(report.date).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}