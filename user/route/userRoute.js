import express from "express";
import multer from "multer";

import { 
    registerUser, 
    getAllUsers, 
    getUserByEmail, 
    deleteUser 
} from "../controller/userController.js";

const uploadFile = multer({storage:multer.memoryStorage()})

const router = express.Router();

router.post("/register", uploadFile.single("image"),registerUser);    
router.get("/",                 getAllUsers);
router.get("/:email",           getUserByEmail);
router.delete("/:email",        deleteUser);

export default router;