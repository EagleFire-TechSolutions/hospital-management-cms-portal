import mongoose from "mongoose";
import {Doctor} from "../models/doctors.models.js";
import { Appointment } from "../models/appointment-patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generatedoctorAccessTokens, generatedoctorRefreshTokens } from "../services/doctor-token.services.js";

//---------------- REGISTER ----------------//
const doctorRegister = async (req, res) => {
  try {
    console.log("POSTMAN BODY:", req.body);
    const { name, email, password , role  , specialization , contact} = req.body;

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
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const doctorCreate = await Doctor.create({
     
      name,
      email:email.toLowerCase(),
      password: hashpassword,
      specialization,
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
 const { doctorId } = req.params;
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

 const uploadRports = async (req , res) => {
    try{
        const {id} = req.params;
        const {reports} = req.body;

        const updatedreports = await Appointment.findByIdAndUpdate(
            id,
            {reports},
            {returnDocument : "after"}
        
        ) 
         res.status(200).json({
            message : "reports updaated successfully",
            updatedreports
        });
    }catch(err){
      console.log(err);
      message : err.message,
      success = false
    }
 }

 export {getDoctorAppointments , updateStatus , uploadRports , AllDoctors};