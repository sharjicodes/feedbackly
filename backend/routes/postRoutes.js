import express from "express";
import {
  createPost,
  getAllPosts,
  uploadMiddleware,
  getMyPosts, // ✅ This must be imported
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/mine", protect, getMyPosts);  // ✅ your own posts
router.post("/", protect, uploadMiddleware, createPost);
router.get("/", getAllPosts);                 // public
export default router;
