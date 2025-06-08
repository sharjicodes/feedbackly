import express from 'express';
import {
  addComment,
  getComments,
  getCommentsOnMyPosts,
  getMyComments,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Place specific routes BEFORE dynamic ones
router.get('/mine/on-my-posts', protect, getCommentsOnMyPosts);
router.get('/mine/my-comments', protect, getMyComments);

router.post('/:postId', addComment);  // public
router.get('/:postId', getComments);  // public

export default router;
