import express from "express"
import zoneModel from "../model/zoneModel"


module.exports.createZoneData = async(req, res)=>{
    try{
        const data = req.body;
        if(data == null || Object.keys(data).length==0){
            return res.send({status:400,data:"Req Body should not be empty or null"});
        }
        
    }catch(err){
        console.log(err.message);
        return res.send({status:500,data:err.message});
    }
}