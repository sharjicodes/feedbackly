import express from "express";
import {
  createPost,
  getPosts,
  uploadMiddleware,
  getMyPosts, // ✅ This must be imported
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/mine", protect, getMyPosts);  // ✅ your own posts
router.post("/", protect, uploadMiddleware, createPost);
router.get("/", getPosts);                 // public
export default router;
