import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import { sendWelcomeMail } from "../service/SnsService.js";
import { uploadImageInS3 } from "../service/S3Service.js";
import { push_To_Queue } from "../service/sqsSevice.js";

export const registerUser = async (req, res) => {
  try {
    const courseList = ["BCA", "BTECH", "MBA", "BBA"];
    const { name, email, phone, city, course, semesterFees, password } =
      req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "Image is required",
      });
    }
    console.log("file data....{}", file);
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email and password are required",
      });
    }

    if (!course || !semesterFees) {
      return res.status(400).json({
        success: false,
        error: "Course and SemesterFees are required",
      });
    }

    if (!courseList.includes(course)) {
      return res.status(400).json({
        success: false,
        error: `Courses are ${courseList.toString()}`,
      });
    }
    const yearsForDegress = {
      BCA: 3,
      MBA: 3,
      BTECH: 4,
      BBA: 3,
    };
    const getHexPassword = await bcrypt.hash(password, 10);
    const getTotalYearsSalary = parseInt(semesterFees) * 2;
    const getTotalFees = getTotalYearsSalary * yearsForDegress[course];
    const getImageUrl = await uploadImageInS3(file);
    const user = await User.saveUser({
      name,
      email,
      phone,
      city,
      course,
      semesterFees: parseInt(semesterFees),
      totalFees: getTotalFees,
      image: getImageUrl,
      password: getHexPassword,
    });
    await push_To_Queue(user);
    res.status(201).json({
      success: true,
      message: `${name} registered successfully!`,
      user,
    });
  } catch (err) {
    if (err.message.includes("already registered")) {
      return res.status(409).json({
        success: false,
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllData();
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    // Check if user exists first
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    await User.deleteData({ email });

    return res.status(200).json({
      success: true,
      message: `User ${email} deleted successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const deleteAllUser = async (req, res) => {
  try {
    console.log("request params url:....", req.url);
    const user = await User.deleteAllDataFromTable();
    if (user.deletedCount == 0) {
      return res.status(404).json({
        success: false,
        error: "No Users data found",
      });
    }
    return res.status(200).json({
      success: true,
      message: `All Users deleted successfully`,
    });
  } catch (err) {
    console.log("Error:", err.message);
     return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }
    const findUser = await User.getUserByEmail(email);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        error: "This Email Doesnot exits",
      });
    }

    const getPassword = findUser.password || null;
    const isMatch = await bcrypt.compare(password, getPassword);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    return res.status(200).json({
      success: true,
      message: `User login successfull`,
    }); 
  } catch (err) {
    console.log("Error..{}", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
