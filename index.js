import express from "express"
import dotenv from "dotenv"
import db from "./db.js";
import userRoute from "./user/route/userRoute.js";
import {process_Queue} from "./user/service/sqsSevice.js"
dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/users", userRoute);

const PORT = 4000;
app.listen(PORT,async ()=>{
    await db.conncet();
    await process_Queue();
    console.log(`Server Running On Port ${parseInt(PORT)||process.env.PORT}`)
});