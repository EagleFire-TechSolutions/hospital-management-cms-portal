import mongoose from "mongoose";
import {Doctor} from "../models/doctors.models.js";
import { Appointment } from "../models/appointment-patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import  ApiErrors  from "../utils/ApiErrors.js";
import { generatedoctorAccessTokens, generatedoctorRefreshTokens } from "../services/doctor-token.services.js";
import { v2 as cloudinary} from "cloudinary";
import path from "path";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//---------------- REGISTER ----------------//
const doctorRegister = async (req, res) => {
  try {
    console.log("POSTMAN BODY:", req.body);
    const { name, email, password , role  ,department ,  specialization , contact} = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill all fields",
        success: false
      });
    };
    if(role !== "patient" && role !== "doctor"){
      return res.status(400).json({
        message : "Invalid role",
        success : false
      })
    }


    const existingemail = await Doctor.findOne({ email:email.toLowerCase() });
    if (existingemail) {
      throw new ApiErrors("Email already exists");
      // return res.status(409).json({
      //   success : false,
      //   message : "Email already exist"
      // })
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const doctorCreate = await Doctor.create({

      name,
      email:email.toLowerCase(),
      password: hashpassword,
      specialization,
      department,
      contact,
      role:"doctor"
    });

    console.log("doctor SAVED:", doctorCreate);

    res.status(201).json({
      message: "doctor created",
      success: true,
      data: {
        id: doctorCreate._id,
        name: doctorCreate.name,
        role: doctorCreate.role,
        specialization: doctorCreate.specialization,
        department : doctorCreate.department,
        contact: doctorCreate.contact,
        email: doctorCreate.email,
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

//---------------- LOGIN ----------------//
const doctorLogin = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
        success: false
      });
    }

    // 2. Find doctor
    const doctor = await Doctor.findOne({
      email: email.toLowerCase()
    }).select("+password");

    console.log("DOCTOR FOUND:", doctor);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
        success: false
      });
    }

    // 3. Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      doctor.password || ""
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }
   const payload = {
  id: doctor._id,
  role: doctor.role
};

const AccessTokens = jwt.sign(
  payload,
  process.env.JWT_ACCESS_TOKENS,
  { expiresIn: "1d" }
);

    // 4. Remove password before sending response
    doctor.password = undefined;

    // 5. Success response
    return res.status(200).json({

      message: "Login successful",
      success: true,
     data: {
    AccessTokens,
  id: doctor._id,
  name: doctor.name,
  email: doctor.email,
  role: doctor.role
}
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }



    //-------- TOKEN + SESSION LOGIC --------//
  try {
    const tempsessionId = new Date().getTime().toString();
    const tempRefreshToken = generatedoctorRefreshTokens(doctor, tempsessionId);

    const decodeRefresh = jwt.verify(tempRefreshToken, process.env.JWT_REFRESH_TOKENS);

    const session = await Session.create({
      doctorId: doctor._id,
      refreshTokenHash: "temp",
      userAgent: req.headers["user-agent"] || "",
      ipAddress: req.ip || "",
      expiresAt: new Date(decodeRefresh.exp * 1000)
    });

    const AccessTokens = generatedoctorAccessTokens(doctor);
    const RefreshTokens = generatedoctorRefreshTokens(doctor, session._id.toString());

    const RefreshTokenHash = await bcrypt.hash(RefreshTokens, 10);
    session.refreshTokenHash = RefreshTokenHash;
    await session.save();

    res.cookie("RefreshTokens", RefreshTokens, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production"
    }).status(200).json({
      message: "doctor login successfully",
      success: true,
      data: {
        AccessTokens,
        user: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          role: doctor.role
        }
      }
    });

  } catch (err) {
    console.log(err);
    console.log("LOGIN ERROR:", err);
    res.status(500).json({
      message: err.message,
      success: false
    });
  }
  };

//---------------- REFRESH TOKEN ----------------//
const refreshdoctorAccessTokens = async (req, res) => {

  const tokens = req.cookies.RefreshTokens;

  if (!tokens) {
    throw new ApiErrors(401, "Refresh tokens missing");
  }

  const decoded = jwt.verify(tokens, process.env.JWT_REFRESH_TOKENS);
 console.log("DECODED TOKEN:", decoded);
  const session = await Session.findById(decoded.sessionId);

  if (!session || session.revokedAt || new Date() > session.expiresAt) {
    throw new ApiErrors(401, "invalid or expired session");
  }

  const isRefreshtokenValid = await bcrypt.compare(tokens, session.refreshTokenHash);

  if (!isRefreshtokenValid) {
    throw new ApiErrors(401, "invalid refresh token");
  }

  //const patient = await patientRegister.findById(decoded.id);

  if (!doctor || !doctor.isActive) {
    throw new ApiErrors(401, "doctor not found");
  }


  const newAccessTokens = generatedoctorAccessTokens(doctor);
  const newRefreshTokens = generatedoctorRefreshTokens(doctor, session._id.toString());

  session.refreshTokenHash = await bcrypt.hash(newRefreshTokens, 10);
  await session.save();

  res.cookie("RefreshTokens", newRefreshTokens, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }).status(200).json({
    success: true,
    message: "tokens refreshed",
    data: {
      AccessTokens: newAccessTokens
    }
  });
};

//---------------- CURRENT PATIENT ----------------//
const getCurrentDoctor = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.doctor._id,
      name: req.doctor.name,
      email: req.doctor.email,
      specialization: req.doctor.specialization,
      contact: req.doctor.contact,

      role: req.doctor.role,
    }
  });
};

//---------------- LOGOUT ----------------//
const logoutDoctor = async (req, res) => {


  const tokens = req.cookies.RefreshTokens;
   console.log("COOKIES:", req.cookies);
  console.log("TOKEN:", tokens);
console.log("log hots");

  if (tokens) {
    try {
      const decoded = jwt.verify(tokens, process.env.JWT_REFRESH_TOKENS);
   console.log("DECODED:", decoded);

      await Session.findByIdAndUpdate(decoded.sessionId, {
        revokedAt: new Date(),
      });

    } catch (err) {
      console.log("error:",err)
      throw new ApiErrors("invalid logout");
    }
  }

  res.clearCookie("RefreshTokens", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  }).status(200).json({
    success: true,
    message: "Patient logged out successfully",
  });
};

//---------------- EXPORTS ----------------//
export { doctorLogin, doctorRegister };

export { logoutDoctor };
export { getCurrentDoctor }

const AllDoctors = async (req , res) => {
    const doctors = await Doctor.find();
    console.log(req.body);
res.status(200).json({
    message : "Doctor find successfully",
  data : doctors
})};
//getting all appointments//
const getDoctorAppointments = async (req , res) => {
    try{
 const  doctorId  = req.doctor._id;
 console.log("Doctor Id from params:" , doctorId);
 if (!doctorId){
  return res.status(400).json({
    message : "Doctor Id is reqiured",
    success : false,
    error : err.message
  })
 };
 console.log("Finding appointmetns:", doctorId);
   if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        message: "Invalid Doctor ID",
        success: false
      });
    }

    const appointments = await Appointment
      .find({ doctorId })
      .populate("doctorId");
console.log("APPOINTMENTS FOR DOCTOR ID:", doctorId, appointments);

  res.status(200).json({
    message :"doctor fetched appointment",
    appointments
  });


    }catch(err){
        console.log("err" , err);
     res.status(500).json({
        message : err.message,
        success : false
     });
    };
};

//update status of getting appointments//
 const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    console.log("API HIT");
    console.log("Body Status:", req.body);

    const appointments = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
console.log("UPDATED DOC:", appointments);
    res.status(200).json({
      message: "status updated successfully",
      appointments
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
      success: false
    });
  }
};

 //update reports by doctors for patients//

 const updateReport = async (req, res) => {
  console.log("=== updateReport called ===");
  console.log("Appointment ID:", req.params.id);
  console.log("Doctor ID:", req.doctor?._id);

  try {
    const appointmentId = req.params.id;
    const doctorId = req.doctor?._id;

    // 1. Make sure the doctor is authenticated
    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Doctor authentication required.",
      });
    }

    // 2. Validate appointment ID
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });
    }

    // 3. Find the appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    // 4. OWNERSHIP CHECK
    // Only the doctor who owns this appointment can upload its report
    if (appointment.doctorId.toString() !== doctorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to upload a report for this appointment.",
      });
    }
    if (appointment.status === "rejected") {
  return res.status(400).json({
    success: false,
    message: "Cannot upload a report for a rejected appointment.",
  });
};

    // 5. Make sure a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No report uploaded.",
      });
    }

    // 6. Upload report to cloudinary
   const result = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "hms/reports",
      resource_type: "raw",
      type: "authenticated",
    },
    (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }
  );

  stream.end(req.file.buffer);
});
    console.log("CLOUDINARY RESULT:", result);

    //7.Save clooudinary files to mongodb

   // 7. Save Cloudinary file information to MongoDB
try {
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  appointment.reportPublicId = result.public_id;
  appointment.reportFormat = fileExtension;

  await appointment.save();

  console.log("REPORT SAVED TO MONGODB:", appointment.reportPublicId);
  console.log("REPORT FORMAT:", appointment.reportFormat);

} catch (dbError) {
  console.error("MongoDB report save error:", dbError);

  try {
    await cloudinary.uploader.destroy(result.public_id, {
      resource_type: "raw",
      type: "authenticated",
    });

    console.log("Cloudinary report cleaned up successfully.");
  } catch (cloudinaryError) {
    console.error("Cloudinary cleanup failed:", cloudinaryError);
  }

  return res.status(500).json({
    success: false,
    message: "Failed to save report information.",
  });
}
    //8.Remove temporary local file
    // fs.unlikeSync(req.file.path);

    //9.suuccess return message
    return res.status(201).json({
      message : "Report uploaded successfully",
      success : true,
      report : result.public_id
    });
  }

    catch (error) {
    console.error("Report upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload report.",
    });
  }
};
 export {getDoctorAppointments , updateStatus , updateReport , AllDoctors};
