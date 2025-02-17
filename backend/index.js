import express from "express";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import connectToDb from "./Database/ConnectToDb.js";
import userRouter from "./Router/UserRouter.js";
import cors from "cors"

const app = express();

connectToDb();
dotenv.config();

const PORT = process.env.PORT || 5000;
cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
});

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.send("hello World");

});
app.listen(PORT, console.log("run"));