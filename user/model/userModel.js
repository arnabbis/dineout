import BaseModel from "../../config/model/baseModel.js";
import dotenv from "dotenv";

class UserModel extends BaseModel {
  constructor() {
    super(process.env.DYNAMODB_TABLE || "Users");
  }

  async saveUser(user) {
    const existingUser = await this.getOne({ email: user.email });
    console.log("existing user",existingUser)
    if (existingUser) {
      throw new Error("Email already registered!");
    }

    const userData = {
      email: user.email,
      name: user.name,
      phone: user.phone || "N/A",
      city: user.city || "N/A",
      course: user.course,
      semesterFees: user.semesterFees,
      totalFees: user.totalFees,
      image:user.image,
      password: user.password,
      registeredAt: new Date().toISOString(),
    };

    return this.put(userData);
  }

   async getUserByEmail(email){
        return this.getOne({email});
   }

   async deleteByEmail(email){
      return this.deleteData({email});
   }

   async deleteAllDataFromTable(){
      return this.deleteAllData();
   }
}

export default new UserModel();
