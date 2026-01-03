const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to protect routes (Duplicate from auth.js - ideally should be in middleware file)
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public (or Private?) - Public for now
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profileImg")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post("/", protect, async (req, res) => {
  const { text, image } = req.body;

  if (!text && !image) {
    return res.status(400).json({ message: "Post must have text or image" });
  }

  try {
    const post = await Post.create({
      user: req.user.id,
      text,
      image,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "username profileImg"
    );

    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
