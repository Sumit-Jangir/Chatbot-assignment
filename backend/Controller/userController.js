import userModel from "../Model/userModel.js";
import bcrypt from 'bcrypt'

export const login = async(req,res)=>{
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({username});
        if(!user){
            res.status(400).json({messasge:"User not found"})
            return;
        }

        const dbPassword = user.password;

        const matchPass = await bcrypt.compare(password, dbPassword)
        if(!matchPass){
            res.status(400).json({messasge:"Invalid password"})
            return;
        }

        return res
      .status(200)
      .json({message: "user login successfully" });


    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:"Internal server error"})
    }
} 