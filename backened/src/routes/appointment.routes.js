import {bookAppointments , getAppointment , updateReport} from "../controllers/apointments.controllers.js";

import express from "express"
import {patientAuthHeader} from "../middlewares/patient_validation.middlewares.js";
import upload from "../middlewares/reportupload.js";

const appointmentrouter = express.Router();
const reportsrouter = express.Router();

appointmentrouter.post("/book",patientAuthHeader,bookAppointments);
appointmentrouter.get("/my" , patientAuthHeader, getAppointment);



export {reportsrouter};
export default appointmentrouter;