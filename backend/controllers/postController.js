import Post from "../models/Post.js";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";

const upload = multer({ storage });
export const uploadMiddleware = upload.single("image");

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.path : null;

    const newPost = new Post({ content, image, author: req.user?.id || null });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ message: "Post creation failed", error: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).populate("comments");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your posts" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("comments");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
};
