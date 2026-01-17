const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const cloudinary = require("../lib/cloudinary");
const multer = require("multer");

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public (or Private?) - Public for now
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profileImg")
      .populate("comments.postedBy", "username profileImg")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    let image = req.body.image; // Allow URL if passed directly (though mostly file now)

    if (!text && !req.file && !image) {
      return res.status(400).json({ message: "Post must have text or image" });
    }

    if (req.file) {
        const uploadToCloudinary = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(buffer);
            });
        };
        const result = await uploadToCloudinary(req.file.buffer);
        image = result.secure_url;
    }

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
    console.error("Error in create post:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post has already been liked
    if (post.likes.includes(req.user.id)) {
        // Unlike
       await post.updateOne({ $pull: { likes: req.user.id } });
       res.status(200).json({ message: "Post unliked" });
    } else {
        // Like
        await post.updateOne({ $push: { likes: req.user.id } });
        res.status(200).json({ message: "Post liked" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post("/comment/:id", protect, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (!text) {
        return res.status(400).json({ message: "Text is required" });
    }

    const comment = {
      text,
      postedBy: req.user.id,
    };

    post.comments.push(comment);
    await post.save();
    
    // Populate the postedBy field of the new comment to return it
    const populatedPost = await Post.findById(req.params.id)
        .populate("comments.postedBy", "username profileImg")
        .populate("user", "username profileImg");

    res.status(200).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
