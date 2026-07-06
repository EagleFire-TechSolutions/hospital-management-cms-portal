import mongoose from "mongoose";
import express from "express";
import db_name from "../constant.js";

const dbconnection = async () => {
    try{
        const connection = await mongoose.connect(`${process.env.MONGO_URL}/${db_name}`);
        console.log(`\n MONDODB!! DB:${connection.connection.host}`);
        console.log("DB is connected");

}
catch(err){
    console.log("sorry to connect");
    console.log(err);
    process.exit(1);
    
};
};

export default dbconnection;