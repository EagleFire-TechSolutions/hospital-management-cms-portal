import mongoose from "mongoose";

const patientRegisterSchema = new mongoose.Schema({

  name: {
    type: String,

    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // hidden by default
  },

  // phone: {
  //   type: String,
  //   default: "",
  //   trim: true,
  // },

  // age: {
  //   type: Number,
  //   default: null,
  // },

  // gender: {
  //   type: String,
  //   enum: ["male", "female", "other"],
  //   default: "other",
  // },

  role: {
    type: String,
    required: true,
    enum: ["doctor", "patient"]
  },

  // isActive: {
  //   type: Boolean,
  //   default: true,
  // },
},



  { timestamps: true });

export const patientRegister = mongoose.model("PatientRegister", patientRegisterSchema);    