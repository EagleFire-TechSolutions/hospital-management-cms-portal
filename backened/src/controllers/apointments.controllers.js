import { Appointment } from "../models/appointment-patient.js";
import { Doctor } from "../models/doctors.models.js";
import path from "path";
import fs from "fs";
import { v2 as cloudinary} from "cloudinary";

//--book appointments--//

const bookAppointments = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log(" BOOK API HIT");
    console.log(" BODY RECEIVED:", req.body);
    console.log(" DOCTOR ID:", req.body.doctorId);
    console.log(" PATIENT:", req.patient._id);


    const patientId = req.patient._id;

    const { name, age, gender, doctorId, department, date, time } = req.body;
    // date setting
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours( 0 , 0, 0 ,0);
  appointmentDate.setHours(0, 0, 0, 0);
  if(appointmentDate < today){
    return res.status(400).json({
      message : "Appointment date cannot be in the past",
      success : false
    })
  };
  // time setting
  const now = new Date();

const selectedDate = new Date(date);

const isToday =
  selectedDate.getFullYear() === now.getFullYear() &&
  selectedDate.getMonth() === now.getMonth() &&
  selectedDate.getDate() === now.getDate();

if (isToday) {
  const [hours, minutes] = time.split(":").map(Number);

  const selectedTime = new Date();
  selectedTime.setHours(hours, minutes, 0, 0);

  if (selectedTime <= now) {
    return res.status(400).json({
      success: false,
      message: "Appointment time must be in the future.",
    });
  }
};
// checking id
    if (!doctorId) {
      return res.status(400).json({
        message: "Doctor ID is required",
        success: false,
      });
    };
      const doctor = await Doctor.findById(doctorId);
       if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
        success: false,
      });
    };
    console.log("REQUEST DEPARTMENT:", department);
console.log("DOCTOR DEPARTMENT:", doctor.department);
    if(department !== doctor.department){
          return res.status(400).json({
            success : false,
            message :"Selected department does not match the doctor's department."
          })
    };

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status : {$ne : "rejected"}
    });

    if(existingAppointment){
      return res.status(409).json({
        success : false,
        message:  "Appointment slot is already booked. Please choose a different time."
      })
    };



    console.log("doctorId:", doctorId);
    console.log("FULL BODY:", req.body);
console.log("doctorId:", doctorId);

    const appointments = await Appointment.create({
      patientId,
      name,
      age,
      gender,
      doctorId,
      department,
      date,
      time,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      success: true,
      appointments,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error booking appointment",
      success: false,
    });
  }
};

//---get appointment--//

const getAppointment = async (req, res) => {
  try {
    console.log(" GET APPOINTMENT API HIT");
    console.log(" PATIENT:", req.patient._id);

    const patientId = req.patient._id;

    const appointments = await Appointment.find({ patientId })
      .populate({
        path: "doctorId",
        select: "name email specialization",
      })
      .lean();

    console.log("RAW APPOINTMENTS FROM DB:", appointments);
    console.log(
      "FINAL POPULATED DATA:",
      JSON.stringify(appointments, null, 2)
    );

    res.status(200).json({
      message: "Appointments fetched successfully",
      success: true,
      appointments,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error fetching appointments",
      success: false,
    });
  }
};

//--get reports--//

const getReport = async (req, res) => {
  try {
    const { reportName } = req.query;
if (!reportName || typeof reportName !== "string") {
  return res.status(400).json({
    success: false,
    message: "Report name is required.",
  });
}

console.log("REPORT NAME:", reportName);
    const appointment = await Appointment.findOne({
     $or:[
      {report : reportName},
      {reportPublicId : reportName},
     ],
    });
console.log("APPOINTMENT FOUND:", appointment);
    if (!appointment) {
  return res.status(404).json({
    success: false,
    message: "Report not found.",
  });
}

if (!appointment.reportPublicId) {
  return res.status(404).json({
    success: false,
    message: "Report file is no longer available.",
  });
}

    // Doctor authorization
    if (req.doctor) {
      if (
        appointment.doctorId.toString() !==
        req.doctor._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this report",
        });
      }
    }

    // Patient authorization
    if (req.patient) {
      if (
        appointment.patientId.toString() !==
        req.patient._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this report",
        });
      }
    }
console.log("REPORT PUBLIC ID:", appointment.reportPublicId);
console.log("REPORT FORMAT:", appointment.reportFormat);
   const reportUrl = cloudinary.utils.private_download_url(
  appointment.reportPublicId,
   appointment.reportFormat.replace(".", ""),
  {
    resource_type: "raw",
    type: "authenticated",
    attachment: true,
  }
);

console.log("SIGNED DOWNLOAD URL:", reportUrl);

return res.status(200).json({
  success: true,
  reportUrl,
});


  } catch (error) {
    console.log("GET REPORT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error accessing report",
    });
  }
};
export {
  bookAppointments,
  getAppointment,
  getReport
};
