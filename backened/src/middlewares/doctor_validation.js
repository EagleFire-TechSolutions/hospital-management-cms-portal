import pkg from "express-validator";
const { body, validationResult } = pkg;

import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { Doctor } from "../models/doctors.models.js";

/* =========================
   DOCTOR REGISTER VALIDATION
========================= */

const validatedoctorRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("department")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Department must be between 2 and 100 characters"),

  body("specialization")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Specialization must be between 2 and 100 characters"
    ),

  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact number is required")
    .matches(/^03\d{9}$/)
    .withMessage("Invalid contact number format"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()[0].msg,
      });
    }

    next();
  },
];

/* =========================
   DOCTOR LOGIN VALIDATION
========================= */

const validatedoctorLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()[0].msg,
      });
    }

    next();
  },
];

/* =========================
   DOCTOR RATE LIMIT
========================= */

const doctorAuthLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,

  message: {
    success: false,
    message: "Too many requests. Please try again later",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

/* =========================
   DOCTOR AUTHENTICATION
========================= */

const doctorAuthHeader = async (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No token provided",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // 3. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKENS
    );

    // 4. Get doctor ID from token
    const doctorId = decoded.id || decoded._id;

    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // 5. Find doctor in database
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // 6. Attach authenticated doctor to request
    req.doctor = doctor;

    // 7. Continue to controller
    next();

  } catch (error) {
    console.log("DOCTOR AUTH ERROR:", error);
     console.log("DOCTOR AUTH ERROR NAME:", error.name);
  console.log("DOCTOR AUTH ERROR MESSAGE:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* =========================
   EXPORTS
========================= */

export {
  validatedoctorRegister,
  validatedoctorLogin,
  doctorAuthLimit,
  doctorAuthHeader,
};
