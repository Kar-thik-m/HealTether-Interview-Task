import express from "express";
import { usermodel } from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import uploadFile from "../Utils/multerAccess.js";
import getUrl from "../Utils/urlgenerator.js";

import cloudinary from "cloudinary";
import { sendToken } from "../Utils/Jwt.js";
import { authenticateToken } from "../Middleware/Authentication.js";

const userRouter = express.Router();

userRouter.post("/register", uploadFile, async (req, res) => {
  try {
    const payload = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = getUrl(file);
    const cloudUpload = await cloudinary.v2.uploader.upload(fileUrl.content);

    const userExists = await usermodel.findOne({ email: payload.email });
    if (userExists)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = new usermodel({
      ...payload,
      password: hashedPassword,
      userimage: { id: cloudUpload.public_id, url: cloudUpload.secure_url },
    });

    await newUser.save();
    sendToken(newUser, 201, res);
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Error registering user details" });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    const existingUser = await usermodel.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found." });

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid)
      return res.status(401).json({ message: "Incorrect password." });

    sendToken(existingUser, 200, res);
  } catch (error) {
    console.error("Login error:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

userRouter.get("/usersdata", authenticateToken, async (req, res) => {
  try {
    const users = await usermodel.find();

    if (!users || users.length === 0)
      return res.status(404).json({ message: "No users found." });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/loaduser", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await usermodel.findById(userId);

    if (!userProfile)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.put(
    "/updateprofile/:id",
    authenticateToken,
    uploadFile, // Multer middleware for file upload
    async (req, res) => {
      const userId = req.params.id;
  
      try {
        const existingUser = await usermodel.findById(userId);
        if (!existingUser) {
          return res.status(404).json({ message: "User not found" });
        }
  
        const { username } = req.body;
  
        if (username) {
          existingUser.username = username;
        }
  
        if (req.file) {
          // Upload file from the buffer using upload_stream
          cloudinary.v2.uploader.upload_stream(
            { resource_type: 'auto' }, // Cloudinary will auto-detect the file type (image, video, etc.)
            async (error, result) => {
              if (error) {
                return res.status(500).json({ message: "Error uploading file to Cloudinary" });
              }
  
              // If the user already has an image, destroy the old image
              if (existingUser.userimage && existingUser.userimage.id) {
                await cloudinary.v2.uploader.destroy(existingUser.userimage.id);
              }
  
              // Set the new image details for the user
              existingUser.userimage = {
                id: result.public_id,
                url: result.secure_url,
              };
  
              // Save the updated user
              const updatedUser = await existingUser.save();
  
              // Send response back
              res.json({ message: "Profile updated successfully", user: updatedUser });
            }
          ).end(req.file.buffer);  // Upload the buffer directly to Cloudinary
        } else {
          // If no file is uploaded, just save the updated username
          const updatedUser = await existingUser.save();
          res.json({ message: "Profile updated successfully", user: updatedUser });
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        res.status(400).json({ message: error.message });
      }
    }
  );
  

export default userRouter;
