import express from "express";
import { createPost, getAllPosts, getMyPosts, uploadMiddleware } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js"; // allow anonymous users

const router = express.Router();

router.post("/", protect, uploadMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/mine", protect, getMyPosts);

export default router;
