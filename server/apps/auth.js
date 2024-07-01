import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  const collection = db.collection("users");
  const userData = { ...req.body };
  const salt = await bcrypt.genSalt(10);
  userData.password = bcrypt.hash(userData.password, salt);
  try {
    await collection.insertOne(userData);
    return res.status(201).json({
      message: "User has been created successfully",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  const user = await db
    .collection("users")
    .findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const isValidPassword = bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.SECRET_KEY,
    { expiresIn: 900000 }
  );

  return res.json({ message: "Login Successfully", token });
});

export default authRouter;
