import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PatientRegister",
        required : true
    },
    name : {
         type  :String,
        required : true
    },
    age:{
         type : Number,
        required : true
    },
    gender : {
          type  :String,
        required : true,
        enum : ["Male" , "Female"]
    },

 doctorId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Doctor",
  required: true
},
    department : {
         type  :String,
        required : true
    },
    date : {
            type : Date,
            required : true
    },
    time : {
            type : String,
            required : true
    },
    status : {
         type  :String,
         enum: ["pending", "approved", "rejected" , "completed"],
    default: "pending"
    },
    report : {
        type : String,
        default : ""
    },
    reportPublicId: {
        type : String,
        default : ""
    },
   reportFormat: {
  type: String,
  default: ""
},
},
    {timestamps:true});

 export const Appointment = mongoose.model("Appointment" , appointmentSchema);
