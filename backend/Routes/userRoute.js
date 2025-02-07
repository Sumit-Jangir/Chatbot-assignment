import express from "express";
import { login } from "../Controller/userController.js";


const route = express.Router();

route.post('/login',login);

export default route