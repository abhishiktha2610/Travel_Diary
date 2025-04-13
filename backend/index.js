// index.js
const config = require("./config.json");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const TravelDiary = require("./models/travelDiary.model");
const { authenticateToken } = require("./utilities");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");
const { error } = require("console");
// Load environment variables
dotenv.config();

const app = express();
mongoose
  .connect(config.connectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json()); // To parse incoming JSON requests
app.use(cors({ origin: "*" })); // To handle Cross-Origin Resource Sharing

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await user.save();
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );
  return res.status(201).json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    accessToken,
    message: "Regestration Successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Email and Password required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return res.json({
    error: false,
    message: "Login Successful",
    user: { fullName: user.fullName, email: user.email },
    accessToken,
  });
});

app.get("/get-user", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: isUser,
    message: "",
  });
});

app.post("/add-travel-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, isFavourite, imageUrl, visitedDate } =
    req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedDate || !visitedLocation || !imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const parsedVisitedDate = new Date(visitedDate);
  try {
    const travelDiary = new TravelDiary({
      title,
      story,
      visitedDate,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
      isFavourite,
    });

    await travelDiary.save();
    res.status(201).json({ story: travelDiary, message: "Added Successfully" });
  } catch {
    return res.status(400).json({ error: true, message: error.message });
  }
});

app.get("/get-all-stories", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const travelDiaries = await TravelDiary.find({ userId: userId }).sort({
      isFavourite: -1,
    });
    res.status(200).json({ stories: travelDiaries });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "No image uploaded" });
    }
    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "imageUrl parameter is required" });
  }
  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(200).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

app.put("/edit-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedDate, visitedLocation, imageUrl } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedDate || !visitedLocation) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const parsedVisitedDate = new Date(visitedDate);
  try {
    const travelDiary = await TravelDiary.findOne({ _id: id, userId: userId });
    if (!travelDiary) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }

    const placeholderImgUrl = `http://localhost:8000/assets/logo4.jpg`;
    travelDiary.title = title;
    travelDiary.story = story;
    travelDiary.visitedLocation = visitedLocation;
    travelDiary.imageUrl = imageUrl || placeholderImgUrl;
    travelDiary.visitedDate = parsedVisitedDate;

    await travelDiary.save();
    res.status(200).json({ story: travelDiary, message: "Update Successful" });
  } catch (error) {
    return res.status(400).json({ error: true, message: error.message });
  }
});

app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const travelDiary = await TravelDiary.findOne({ _id: id, userId: userId });
    if (!travelDiary) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }
    await travelDiary.deleteOne({ _id: id, userId: userId });

    const imageUrl = travelDiary.imageUrl;
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete image file:", err);
      }
    });
    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { isFavourite } = req.body;

  try {
    const travelDiary = await TravelDiary.findOne({ _id: id, userId: userId });
    if (!travelDiary) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }
    travelDiary.isFavourite = isFavourite;

    await travelDiary.save();
    res.status(200).json({ story: travelDiary, message: "update succesful" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

app.post("/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    return res.status(404).json({ error: true, message: "query is required" });
  }

  try {
    const searchResults = await TravelDiary.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({
        error: true,
        message: "Both startDate and endDate are required",
      });
  }

  try {
    const travelDiaries = await TravelDiary.find({
      userId: req.user.userId,
      visitedDate: {
        $gte: new Date(parseInt(startDate)), // Convert timestamp to Date object
        $lte: new Date(parseInt(endDate)), // Convert timestamp to Date object
      },
    }).sort({ visitedDate: -1 }); // Sort by date in descending order

    res.status(200).json({ stories: travelDiaries });
  } catch (error) {
    console.error("Error fetching filtered travel stories:", error);
    res.status(500).json({ error: true, message: error.message });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "assets")));

app.listen(8000);
module.exports = app;
