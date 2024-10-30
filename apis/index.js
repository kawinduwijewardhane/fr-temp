import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import User from "./model/user.js";
import dotenv from "dotenv";
import connection from "./config/connection.js";
import path from "path";
import cors from "cors";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

app.post("/createUser", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, dob, socialLinks, videoLinks, bio } = req.body;
    let profileImage = req.file ? req.file.filename : null;

    const newUser = new User({
      name,
      dob,
      bio,
      profileImage,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : [],
      videoLinks: videoLinks ? JSON.parse(videoLinks) : [],
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error." });
  }
});

app.get("/getall", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error." });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connection();
  console.log(`Server is running on port ${PORT}`);
});
