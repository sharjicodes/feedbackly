import express from 'express';
import {
  addComment,
  getComments,
  getCommentsOnMyPosts,
  getMyComments,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mine/on-my-posts', protect, getCommentsOnMyPosts);
router.get('/mine/my-comments', protect, getMyComments);

router.post('/:postId', addComment);
router.get('/:postId', getComments);

export default router;
