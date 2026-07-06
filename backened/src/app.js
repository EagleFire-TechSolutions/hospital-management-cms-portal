import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {patientAuthHeader} from "./middlewares/patient_validation.middlewares.js";


const app = express();


dotenv.config({
    path : "./.env"
});

app.use(cors({
    origin : "*",
    credentials : true
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(helmet());
app.use(cookieParser());

app.get("/" , (req , res) => {
    res.send("Hello server is running");
});
app.use((req, res, next) => {
  console.log("GLOBAL:", req.method, req.url);
  next();
});

app.post("/logout-test", (req, res) => {
  console.log("DIRECT LOGOUT HIT");
  res.send("OK");
});
//routers





//router import//

import { patientrouter }  from "./routes/patients.routes.js";
import appointmentrouter from "./routes/appointment.routes.js";
import { reportsrouter } from "./routes/appointment.routes.js";
import { doctorrouter } from "./routes/doctors.routes.js";



app.use("/api/patient",patientrouter);
app.use("/api/reports",reportsrouter);
app.use("/api/appointment",appointmentrouter);
app.use("/api/appointments",doctorrouter);
app.use("/api/doctors" , doctorrouter);

export {app};