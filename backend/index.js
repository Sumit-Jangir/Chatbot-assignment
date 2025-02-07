import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userModel from './Model/userModel.js';
dotenv.config();
import bcrypt from 'bcrypt'
import userRoute from './Routes/userRoute.js'

const app = express();

const port = process.env.PORT || 5000;
const MONGOURL =process.env.MONGO_URI;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth',userRoute)

mongoose.connect(MONGOURL)
.then(()=>{
    console.log('MongoDB Connected Successfully');
})
.catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
  });




//   const insertUser = async () => {
//     try {
//       const username = "admin";
//       const password = "admin123";
  
//       const salt = bcrypt.genSaltSync(10);
//       const hash = bcrypt.hashSync(password, salt);
  
//       const newUser = new userModel({
//         username,
//         password: hash, 
//       });
  
//       await newUser.save(); 
//       console.log("User inserted successfully!");
//       mongoose.connection.close();
//     } catch (error) {
//       console.error("Error inserting user:", error);
//     }
//   };
//   insertUser();
  

  app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    
  })