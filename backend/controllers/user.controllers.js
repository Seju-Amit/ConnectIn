import { Router } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import multer from "multer";

const router = Router();

export const register = async (req, res) => {

  console.log(req.body);

  try {

    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });

    await profile.save();

    return res.json({ message: "User created Successfully " });
  } catch (error) {
    return res.json({ message: "error occured" });
  }

};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

    return res.json(token);
  } catch (error) {
    return res.json({ message: "error occured" });
  }
};

export default uploadProfilePicture = async(req, res ) =>{
  
  const token = req.body.token;
  
  try {

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    user.ProfilePicture = req.file.filename;

    await user.save();

    return res.json({ message: "Profile picture updated successfully" }); 
  
  } catch(error){
    return res.json({ message: "error occured" });
  }
}
