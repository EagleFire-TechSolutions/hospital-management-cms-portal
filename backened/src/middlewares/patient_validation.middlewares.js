import pkg from "express-validator";
const { body, validationResult } = pkg;

import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { patientRegister } from "../models/patient-register-models.js";

/* =========================
   REGISTER VALIDATION
========================= */

const validatepatientRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role").trim().notEmpty().withMessage("Role is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()[0].msg
      });
    }
    next();
  }
];

/* =========================
   LOGIN VALIDATION
========================= */

const validatepatientLogin = [
  body("email").trim().isEmail().withMessage("valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()[0].msg
      });
    }
    next();
  }
];

/* =========================
   RATE LIMIT
========================= */

const patientAuthLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    message: "Too many requests. Please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false
});

/* =========================
   AUTH MIDDLEWARE
========================= */

const patientAuthHeader = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized. No token provided",
        success: false
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. extra safety check
    if (!token || token === "undefined") {
      return res.status(401).json({
        message: "Invalid token",
        success: false
      });
    }

    // 3. verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKENS);
    console.log("decoded token:", decoded);

    // 4. support id formats
    const patientId = decoded.id || decoded._id;

    if (!patientId) {
      return res.status(401).json({
        message: "Invalid token payload",
        success: false
      });
    }

    // 5. find patient
    const patient = await patientRegister.findById(patientId);

    if (!patient ) {
      return res.status(401).json({
        message: "Patient not found ",
        success: false
      });
    }

    // 6. FIXED: attach correctly
    req.patient = patient;

    next();

  } catch (err) {
    console.log("AUTH ERROR:", err);

    return res.status(401).json({
      message: "Invalid or expired token",
      success: false
    });
  }
};

/* =========================
   EXPORTS
========================= */

export {
  patientAuthLimit,
  patientAuthHeader,
  validatepatientRegister,
  validatepatientLogin
};