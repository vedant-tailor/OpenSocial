const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cloudinary = require("../lib/cloudinary");
const multer = require("multer");

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { protect } = require("../middleware/authMiddleware");

// @route GET /api/users/profile/:username
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/users/update
router.put("/update", protect, upload.fields([{ name: "profileImg" }, { name: "coverImg" }]), async (req, res) => {
    try {
        const { bio } = req.body;
        let { profileImg, coverImg } = req.body; // Allow URLs if passed directly

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Helper to upload to cloudinary from buffer
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

        if (req.files["profileImg"]) {
            const result = await uploadToCloudinary(req.files["profileImg"][0].buffer);
            profileImg = result.secure_url;
        }

        if (req.files["coverImg"]) {
            const result = await uploadToCloudinary(req.files["coverImg"][0].buffer);
            coverImg = result.secure_url;
        }

        user.bio = bio || user.bio;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            bio: updatedUser.bio,
            profileImg: updatedUser.profileImg,
            coverImg: updatedUser.coverImg,
        });

    } catch (error) {
        console.error("Error in update profile:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/users/follow/:id
// @desc    Follow a user
// @access  Private
router.post("/follow/:id", protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: "You already follow this user" });
    }

    await userToFollow.updateOne({ $push: { followers: req.user.id } });
    await currentUser.updateOne({ $push: { following: req.params.id } });

    res.status(200).json({ message: "User followed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/users/unfollow/:id
// @desc    Unfollow a user
// @access  Private
router.post("/unfollow/:id", protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: "You don't follow this user" });
    }

    await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
    await currentUser.updateOne({ $pull: { following: req.params.id } });

    res.status(200).json({ message: "User unfollowed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
