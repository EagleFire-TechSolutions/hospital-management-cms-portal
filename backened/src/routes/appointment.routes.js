import {bookAppointments , getAppointment} from "../controllers/apointments.controllers.js";
import { getReports } from "../controllers/apointments.controllers.js";
import express from "express"
import {patientAuthHeader} from "../middlewares/patient_validation.middlewares.js";

const appointmentrouter = express.Router();
const reportsrouter = express.Router();

appointmentrouter.post("/book",patientAuthHeader,bookAppointments);
appointmentrouter.get("/my" , patientAuthHeader, getAppointment);

reportsrouter.get("/get",patientAuthHeader, getReports);

export {reportsrouter};
export default appointmentrouter;