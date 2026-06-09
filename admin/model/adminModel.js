import mongoose from "mongoose";

const AdminModel = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
    },
    isSuperAdmin:{
        type:Boolean,
        required:true
    },
    Address:{
        type:String,
        required:true
    }
})