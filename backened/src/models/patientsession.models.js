import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
patientId:{
   type : mongoose.Schema.Types.ObjectId,
   ref : "patientRegister",
   required  :true
},
refreshTokenHash:{
    type : String,
    required  : true
},
userAgent:{
     type : String,
    default  : ""
},
ipAddress:{
     type : String,
    default  : ""
},
expiresAt:{
     type : Date,
    default  : ""
},
revokedAt:{
     type : Date,
    default  : ""
}


},
    {timestamps : true});

 export const Session = mongoose.model("Session",sessionSchema);   