const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const { protect } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

// All routes require auth + admin
router.use(protect, adminMiddleware);

// @route   GET /api/admin/stats
// @desc    Get platform stats: total users, total posts
// @access  Admin
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    res.json({ totalUsers, totalPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/admin/most-liked-post
// @desc    Get the post with the most likes
// @access  Admin
router.get("/most-liked-post", async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: { likesCount: { $size: "$likes" } },
      },
      { $sort: { likesCount: -1 } },
      { $limit: 1 },
    ]);

    if (!posts.length) return res.json(null);

    const post = await Post.findById(posts[0]._id)
      .populate("user", "username profileImg")
      .populate("comments.postedBy", "username profileImg");

    res.json({ post, likesCount: posts[0].likesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/admin/most-commented-post
// @desc    Get the post with the most comments
// @access  Admin
router.get("/most-commented-post", async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: { commentsCount: { $size: "$comments" } },
      },
      { $sort: { commentsCount: -1 } },
      { $limit: 1 },
    ]);

    if (!posts.length) return res.json(null);

    const post = await Post.findById(posts[0]._id)
      .populate("user", "username profileImg")
      .populate("comments.postedBy", "username profileImg");

    res.json({ post, commentsCount: posts[0].commentsCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/admin/most-followed-user
// @desc    Get the user with the most followers + their posts
// @access  Admin
router.get("/most-followed-user", async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $addFields: { followersCount: { $size: "$followers" } },
      },
      { $sort: { followersCount: -1 } },
      { $limit: 1 },
    ]);

    if (!users.length) return res.json(null);

    const user = await User.findById(users[0]._id).select("-password");
    const posts = await Post.find({ user: user._id })
      .populate("user", "username profileImg")
      .populate("comments.postedBy", "username profileImg")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ user, followersCount: users[0].followersCount, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
