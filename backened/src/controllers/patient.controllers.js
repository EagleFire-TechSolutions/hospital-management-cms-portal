import { patientRegister } from "../models/patient-register-models.js";
import ApiErrors from "../utils/ApiErrors.js";
import { asynchandler } from "../utils/Asynchandler.js";
import jwt from "jsonwebtoken";
import { generatepatientAccessTokens, generatepatientRefreshTokens } from "../services/patient-token.services.js";
import bcrypt from "bcryptjs";
import { Session } from "../models/patientsession.models.js";

//---------------- REGISTER ----------------//
const patientregister = async (req, res) => {
  try {
    console.log("POSTMAN BODY:", req.body);
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill all fields",
        success: false
      });
    }

    if (role !== "patient" && role !== "doctor") {
      return res.status(400).json({
        message: "Invalid role",
        success: false
      });
    }

    const existingemail = await patientRegister.findOne({ email:email.toLowerCase() });
    if (existingemail) {
      // throw new ApiErrors("Email already exists");
      return res.status(409).json({
        success : false,
        message : "Email already exists"
      })
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const patientCreate = await patientRegister.create({
      name,
      email: email.toLowerCase(),
      password: hashpassword,
      role: "patient",
    });

    console.log("PATIENT SAVED:", patientCreate);

    res.status(201).json({
      message: "Patient created",
      success: true,
      data: {

          id: patientCreate._id,
          name: patientCreate.name,
          role: patientCreate.role,
          email: patientCreate.email,
          token: patientCreate.token

      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message || "Internal server error",
      success: false
    });
  }
};

//---------------- LOGIN ----------------//
const patientLogin = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
        success: false
      });
    }

    const patient = await patientRegister.findOne({ email }).select("+password");
    console.log("PATIENT FOUND:", patient);

    if (!patient) {
      return res.status(404).json({
        message: "patient not found",
        success: false
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, patient.password || "");

    if (!isPasswordCorrect) {
      throw new ApiErrors(401, "Invalid email or password");
    }

    //  FIXED: ONLY ONE TOKEN METHOD
    const AccessTokens = generatepatientAccessTokens(patient);

    //-------- TOKEN + SESSION LOGIC --------//

    const tempsessionId = new Date().getTime().toString();
    const tempRefreshToken = generatepatientRefreshTokens(patient, tempsessionId);

    const decodeRefresh = jwt.verify(tempRefreshToken, process.env.JWT_REFRESH_TOKENS);

    const session = await Session.create({
      patientId: patient._id,
      refreshTokenHash: "temp",
      userAgent: req.headers["user-agent"] || "",
      ipAddress: req.ip || "",
      expiresAt: new Date(decodeRefresh.exp * 1000)
    });

    const RefreshTokens = generatepatientRefreshTokens(patient, session._id.toString());

    const RefreshTokenHash = await bcrypt.hash(RefreshTokens, 10);
    session.refreshTokenHash = RefreshTokenHash;
    await session.save();

    res.cookie("RefreshTokens", RefreshTokens, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production"
    }).status(200).json({
      message: "patient login successfully",
      success: true,
      data: {
        AccessTokens,

          id: patient._id,
          name: patient.name,
          email: patient.email,
          role: patient.role

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

//---------------- REFRESH TOKEN ----------------//
const refreshPatientAccessTokens = async (req, res) => {
  const tokens = req.cookies.RefreshTokens;

  if (!tokens) {
    throw new ApiErrors(401, "Refresh tokens missing");
  }

  const decoded = jwt.verify(tokens, process.env.JWT_REFRESH_TOKENS);

  const session = await Session.findById(decoded.sessionId);

  if (!session || session.revokedAt || new Date() > session.expiresAt) {
    throw new ApiErrors(401, "invalid or expired session");
  }

  const isRefreshtokenValid = await bcrypt.compare(tokens, session.refreshTokenHash);

  if (!isRefreshtokenValid) {
    throw new ApiErrors(401, "invalid refresh token");
  }

  const patient = await patientRegister.findById(decoded.id);

  if (!patient || !patient.isActive) {
    throw new ApiErrors(401, "patient not found");
  }

  const newAccessTokens = generatepatientAccessTokens(patient);
  const newRefreshTokens = generatepatientRefreshTokens(patient, session._id.toString());

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
const getCurrentPatient = asynchandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.patient._id,
        name: req.patient.name,
        email: req.patient.email,
        phone: req.patient.phone,
        age: req.patient.age,
        gender: req.patient.gender,
        role: req.patient.role,
      }
    }
  });
});

//---------------- LOGOUT ----------------//
const logoutPatient = async (req, res) => {
  const tokens = req.cookies.RefreshTokens;

  console.log("COOKIES:", req.cookies);
  console.log("TOKEN:", tokens);

  if (tokens) {
    try {
      const decoded = jwt.verify(tokens, process.env.JWT_REFRESH_TOKENS);

      await Session.findByIdAndUpdate(decoded.sessionId, {
        revokedAt: new Date(),
      });

    } catch (err) {
      console.log("error:", err);
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
export { patientLogin, patientregister };
export { refreshPatientAccessTokens };
export { logoutPatient };
export { getCurrentPatient };
