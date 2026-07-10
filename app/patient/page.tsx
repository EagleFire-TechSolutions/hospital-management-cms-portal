"use client";

import { useRouter } from "next/navigation";

export default function PatientDashboard() {
  const router = useRouter();

  const handlePatientAction = (action: string) => {
    if (action === "book") {
      router.push("/patient/book-appointment");
    } else if (action === "appointments") {
      router.push("/patient/view-appointments");
    } else if (action === "reports") {
      router.push("/patient/reports");
    } else {
      alert("No Further Options");
    }
  };

  return (
    <section className="patient-model">

      {/* Patient Dashboard */}

      <div id="patient-model">
        <div className="p-hed">
          <h1>Welcome to Your Dashboard</h1>
        </div>

        <div className="pa-mo-content">

          <button
            id="p-model-btn"
            onClick={() => handlePatientAction("book")}
          >
            Book Appointment
            <i className="fa-solid fa-book-medical"></i>
          </button>

          <button
            id="p-model-btn"
            onClick={() => handlePatientAction("appointments")}
          >
            My Appointments
            <i className="fa-solid fa-calendar-check"></i>
          </button>

          <button
            id="p-model-btn"
            onClick={() => handlePatientAction("reports")}
          >
            Medical Reports
            <i className="fa-solid fa-file-medical"></i>
          </button>

        </div>
      </div>

     
     

    </section>
  );
}