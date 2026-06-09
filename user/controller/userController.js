import User from "../model/userModel.js";
import { sendWelcomeMail } from "../service/SnsService.js";
import { uploadImageInS3 } from "../service/S3Service.js";
import {push_To_Queue} from "../service/sqsSevice.js"

export const registerUser = async (req, res) => {
  try {
    const courseList = ["BCA", "BTECH", "MBA", "BBA"];
    const { name, email, phone, city, course, semesterFees } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "Image is required",
      });
    }
    console.log("file data....{}", file);
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
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

    res.status(200).json({
      success: true,
      message: `User ${email} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
