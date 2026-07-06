 import {patientLogin , patientregister} from "../controllers/patient.controllers.js";
 import  
 { refreshPatientAccessTokens ,
  
  getCurrentPatient } from "../controllers/patient.controllers.js";
  import {patientAuthHeader,
validatepatientRegister , validatepatientLogin,
patientAuthLimit} from "../middlewares/patient_validation.middlewares.js";
import { logoutPatient } from "../controllers/patient.controllers.js";
 import express from "express";


const patientrouter = express.Router();

patientrouter.get("/test", (req, res) => {
  res.send("Patient route working");
});

patientrouter.post(
  "/login",
 
  patientLogin
);

patientrouter.post(
  "/register",
  patientAuthLimit,
  validatepatientRegister,
  patientregister
);

patientrouter.post("/refresh", refreshPatientAccessTokens);

patientrouter.post("/logout", logoutPatient);

patientrouter.get("/me", patientAuthHeader, getCurrentPatient);

export { patientrouter };