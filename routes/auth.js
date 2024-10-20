const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = "1234"; // Replace with a strong secret in your environment variables

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, password, isAdmin } = req.body;

  try {
    const newUser = new User({ username, password, isAdmin });
    await newUser.save();
    res.status(201).send("User created successfully!");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Send user data in response, including isAdmin
    return res.json({
      token,
      user: {
        username: user.username,
        _id: user._id,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Route to fetch total users
router.get("/totalUsers", async (req, res) => {
  try {
    const totalUsers = await User.find(); 
    res.status(200).json(totalUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});
module.exports = router;
