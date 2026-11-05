    import mongoose, { SchemaType } from "mongoose";

    const doctorSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique: true,
        lowercase : true,
        trim : true,
    },
    password: {
    type: String,
    required: true,
    select: false
    },
    specialization : {
        type : String,
    trim : true,
    },
    department : {
    type: String,
    required : true
    },
    contact : {
        type : String,
        trim: true,

    },
    role: {
    type: String,
    required: true,
    enum: ["doctor"],
    default : "doctor",
    }},

    {timestamps : true});

    export const Doctor = mongoose.model("Doctor" , doctorSchema);
