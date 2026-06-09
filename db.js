import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

class DbConncetion{
    constructor(){
        this.conncetion = null;
    }

    async conncet(){
        try{
            if(this.conncetion){
                console.log("Using Existing Db Conncetion");
                return this.conncetion;
            }
            this.conncetion = await mongoose.connect(process.env.DB_CONNCETION_STRING,{
            })
            console.log("MongoDb Connceted Successfully");
        }catch(err){
            console.log(err);
            throw new Error("Something went wrong: " + err.message)
        }
    }
}

export default new DbConncetion();