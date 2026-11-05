import {bookAppointments , getAppointment ,  getReport} from "../controllers/apointments.controllers.js";

import express from "express"
import {patientAuthHeader } from "../middlewares/patient_validation.middlewares.js";
import { validateBookAppointment } from "../middlewares/appointment_validation.js";
import { doctorAuthHeader } from "../middlewares/doctor_validation.js";

const appointmentrouter = express.Router();
const reportsrouter = express.Router();

appointmentrouter.post("/book",patientAuthHeader, validateBookAppointment,bookAppointments);
appointmentrouter.get("/my" , patientAuthHeader, getAppointment);
reportsrouter.get(
  "/doctor",
  doctorAuthHeader,
  getReport
);

reportsrouter.get(
  "/patient",
  patientAuthHeader,
  getReport
);


export {reportsrouter};
export default appointmentrouter;
