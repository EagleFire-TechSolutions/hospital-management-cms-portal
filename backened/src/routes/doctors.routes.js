import express from "express";

import {
  getDoctorAppointments,
  updateStatus,
  updateReport,
  AllDoctors,
  doctorLogin,
  doctorRegister,
  logoutDoctor,
  getCurrentDoctor,
} from "../controllers/doctors.controllers.js";

import {
  doctorAuthHeader,
  validatedoctorLogin,
  validatedoctorRegister,
} from "../middlewares/doctor_validation.js";

import upload from "../middlewares/reportupload.js";

const doctorrouter = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

// Get all doctors
doctorrouter.get("/AllDoctors", AllDoctors);

// Doctor login
doctorrouter.post(
  "/login",
  validatedoctorLogin,
  doctorLogin
);

// Doctor registration
doctorrouter.post(
  "/register",
  validatedoctorRegister,
  doctorRegister
);


/* =========================
   PROTECTED ROUTES
========================= */

// Current logged-in doctor
doctorrouter.get(
  "/me",
  doctorAuthHeader,
  getCurrentDoctor
);

// Doctor appointments
doctorrouter.get(
  "/appointments",
  doctorAuthHeader,
  getDoctorAppointments
);

// Update appointment status
doctorrouter.put(
  "/status",
  doctorAuthHeader,
  updateStatus
);

// Upload patient report
doctorrouter.put(
  "/upload-report/:id",
  doctorAuthHeader,
  upload.single("report"),
  updateReport
);

// Logout
doctorrouter.post(
  "/logout",
  logoutDoctor
);

export { doctorrouter };
