import {getDoctorAppointments , updateStatus , updateReport , AllDoctors} from "../controllers/doctors.controllers.js";
import express from "express";
import {doctorLogin, doctorRegister ,

 logoutDoctor ,
 getCurrentDoctor } from "../controllers/doctors.controllers.js";
 import upload from "../middlewares/reportupload.js";

const doctorrouter = express.Router();

doctorrouter.get("/AllDoctors", AllDoctors);

doctorrouter.put("/status",updateStatus);
doctorrouter.post("/login" , doctorLogin);
doctorrouter.post("/register" , doctorRegister);
doctorrouter.put(
  "/upload-report/:id",
  upload.single("report"),
  updateReport
);
doctorrouter.get("/:doctorId", getDoctorAppointments);
doctorrouter.post("/Alldoctors", AllDoctors);
export { doctorrouter };