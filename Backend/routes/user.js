const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cloudinary = require("../lib/cloudinary");
const multer = require("multer");

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Middleware defined below

// Re-declaring protect for now since it wasn't exported separately in auth.js
// Ideally we should refactor, but for speed keeping it here or we can extract it.
// Let's check if we can extract it quickly. No, user.js is new.
// Wait, I saw protect in auth.js line 8. It wasn't exported.
// I should probably move protect to a separate file first or copy it.
// To avoid breaking auth.js right now with a refactor, I will copy it, but best practice is to move it.
// Let's create a middleware file first? The plan didn't say so, but it's cleaner. 
// Actually, I can just copy it for now to be safe and fast as per "Web App Dev" "don't surprise user".
// But duplications are bad.
// Let's see if I can simply export it from auth.js? No, because auth.js exports `router`.
// Okay, I will create a simple middleware file first.

// Wait, I'll stick to the plan. I'll just verify if I should make a middleware file.
// Let's just create the route file.

const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
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
router.put("/update", protectRoute, upload.fields([{ name: "profileImg" }, { name: "coverImg" }]), async (req, res) => {
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

module.exports = router;
