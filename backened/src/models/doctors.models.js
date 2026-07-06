import mongoose, { SchemaType } from "mongoose";

const doctorSchema = new mongoose.Schema({
name :{
    type : String,
    required : true
},
email : {
     type : String,
    required : true
},
password: {
  type: String,
  required: true,
  select: false
},
specialization : {
    type : String,

},
contact : {
    type : Number,
    
},
role: {
  type: String,
  required: true,
  enum: ["doctor", "patient"]
}},

{timestamps : true});

export const Doctor = mongoose.model("Doctor" , doctorSchema);