// /controllers/postController.js
import Post from "../models/Post.js";
import multer from "multer";
import { storage } from "../utils/cloudinary.js"; // ✅ import Cloudinary storage

const upload = multer({ storage });
export const uploadMiddleware = upload.single("image");

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.path : null; // Cloudinary returns full URL in `file.path`

    const newPost = new Post({ content, image, author: req.user?.id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Post creation failed", error });
  }
};
// backend/controllers/postController.js

export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ author: userId }).populate("comments");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your posts" });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("comments");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};
