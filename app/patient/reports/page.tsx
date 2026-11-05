
"use client";

import Sidebar from "@/components/layouts/Sidebar";
import { useEffect, useState } from "react";
import { FileText, CalendarDays, UserRound, Eye } from "lucide-react";

interface Report {
  _id: string;
  doctorId?: {
    name: string;
  };
  report?: string;
  reportPublicId?: string;
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

  const viewReport = async (reportPublicId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:2000/api/reports/patient?reportName=${encodeURIComponent(reportPublicId)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to open report.");
        return;
      }

      if (!data.reportUrl) {
        alert("Report URL not found.");
        return;
      }

      window.open(data.reportUrl, "_blank");
    } catch (error) {
      console.error("Error viewing report:", error);
      alert("Unable to open report.");
    }
  };

  return (
    <div id="My-Reports">
      <Sidebar />

      <main className="my-reports-main">
        <header className="reports-header">
          <div className="reports-heading-icon">
            <FileText size={28} />
          </div>

          <div>
            <p className="reports-eyebrow">PATIENT RECORDS</p>
            <h1>My Medical Reports</h1>
            <p className="reports-subtitle">
              Access and review your medical reports in one place.
            </p>
          </div>
        </header>

        <section className="reports-summary">
          <div className="summary-icon">
            <FileText size={24} />
          </div>
          <div>
            <span>Total Reports</span>
            <h2>{reports.length}</h2>
          </div>
        </section>

        <section className="reports-section">
          <div className="reports-section-heading">
            <div>
              <h2>Report History</h2>
              <p>Your medical records and uploaded documents</p>
            </div>
          </div>

          <div id="reports-container">
            {reports.length === 0 ? (
              <div className="reports-empty">
                <div className="empty-icon">
                  <FileText size={34} />
                </div>
                <h3>No Reports Available</h3>
                <p>Your uploaded medical reports will appear here.</p>
              </div>
            ) : (
              reports.map((report) => (
                <article className="report-card" key={report._id}>
                  <div className="report-card-icon">
                    <FileText size={25} />
                  </div>

                  <div className="report-card-details">
                    <h3>Medical Report</h3>

                    <p className="report-doctor">
                      <UserRound size={15} />
                      {report.doctorId
                        ? report.doctorId.name
                        : "Not Assigned"}
                    </p>

                    <p className="report-date">
                      <CalendarDays size={15} />
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="report-card-action">
                    {report.reportPublicId ? (
                      <button
                        className="view-report-btn"
                        onClick={() => viewReport(report.reportPublicId!)}
                      >
                        <Eye size={17} />
                        View Report
                      </button>
                    ) : (
                      <span className="report-not-uploaded">
                        Not Uploaded
                      </span>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
