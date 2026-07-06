import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PatientRegister"
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
        required : true
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
         enum: ["pending", "approved", "rejected"],
    default: "pending"
    }
},
    {timestamps:true});

 export const Appointment = mongoose.model("Appointment" , appointmentSchema);    