import mongoose from "mongoose";

const zoneModel = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    zoneHead:{
        type:String,
        required:true
    },
    ZoneMobileNumber:{
        type:String,
        required:true
    }
},{ timestamps: true });

module.exports = mongoose.model("Zone",zoneModel);