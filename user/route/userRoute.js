import express from "express";
import multer from "multer";

import { 
    registerUser, 
    getAllUsers, 
    getUserByEmail, 
    deleteUser,
    deleteAllUser,
    LoginUser
} from "../controller/userController.js";

const uploadFile = multer({storage:multer.memoryStorage()})

const router = express.Router();

router.post("/register", uploadFile.single("image"),registerUser);   
router.post("/login",LoginUser) 
router.get("/",                 getAllUsers);
router.get("/:email",           getUserByEmail);
router.delete("/deleteAllUsers",deleteAllUser);
router.delete("/:email",        deleteUser);

export default router;