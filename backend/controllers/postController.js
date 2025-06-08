import Post from "../models/Post.js";
import multer from "multer";

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

export const uploadMiddleware = upload.single("image");

// Create a new post
export const createPost = async (req, res) => {
  const { content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const newPost = new Post({ content, image, author: req.user?.id });
  await newPost.save();
  res.status(201).json(newPost);
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "_id name"); // ✅ This line is key
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};


// ✅ Get posts created by the logged-in user
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your posts' });
  }
};

