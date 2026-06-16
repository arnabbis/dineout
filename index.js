import express from "express"
import dotenv from "dotenv"
import db from "./db.js";
import userRoute from "./user/route/userRoute.js";
import {process_Queue} from "./user/service/sqsSevice.js"
dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/users", userRoute);

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

app.get("/", (req, res) => {
    console.log("ROOT HIT");
    return res.status(200).json({
        message: "Dineout API running!"
    });
});

const PORT = 4000;
app.listen(PORT,async ()=>{
    await db.conncet();
    console.log(`Server Running On Port ${parseInt(PORT)||process.env.PORT}`)
});
console.log("INDEX FILE LOADED");
process_Queue();