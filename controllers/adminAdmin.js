import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminDB from '../models/Admin.js';


export const signin = async (req, res) => {

  try {

    const { email, password } = req.body;
    
    if (!email || 
        !email.includes('@') || 
        !password || 
        password.length <= 7) return res.status(422).json({ message: "Invalid data for admin login" });

    const admin = await AdminDB.findOne({ email });

    if (!admin) return res.status(404).json({ message: "Admin doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { 
        id: admin._id,
        name: admin.name,
        email: admin.email,
        main: admin.main
      },
      process.env.JWT_SECRET
    );

    const result = { 
        token,
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        main: admin.main
    };

    res.status(200).json({ ...result });

  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }

};


export const signup = async (req, res) => {

  try {
    
    const { name, email, password, main } = req.body;
    
    if (!name || 
        !email || 
        !email.includes('@') || 
        !password || 
        password.length <= 7) return res.status(422).json({ message: "Invalid data for admin creation" });
    
    const admin = await AdminDB.findOne({ email });

    if (admin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await AdminDB.create({ name, email, password: hashedPassword, main });

    res.status(201).json({ message: "Admin added successfully" });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }

};


export const getAllAdmin = async (req, res) => {

  try {

    const items = await AdminDB.find();
    res.status(200).json(items);

  } catch (error) {

    res.status(404).json({ message: error.message });

  }

}

/*

export const updateAdmin = async (req, res) => {

  const { id } = req.params;
  const { name, enabled } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No admin with id: ${id}`});

  const updatedItem = { name, enabled };

  await AdminDB.findByIdAndUpdate(id, updatedItem, { new: true });

  res.json(updatedItem);

}

*/

export const deleteAdmin = async (req, res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No admin with id: ${id}`});

  await AdminDB.findByIdAndRemove(id);

  res.json({ message: "Admin deleted successfully." });

}