//commemntcontroller.js
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

export const addComment = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!content) return res.status(400).json({ message: 'Comment content is required' });
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (req.user && post.author?.toString() === req.user.id) {
      return res.status(403).json({ message: "You can't comment on your own post" });
    }

    const comment = new Comment({
      post: postId,
      content,
      commenter: req.user ? req.user.id : null,
    });

    const savedComment = await comment.save();
    post.comments.push(savedComment._id);
    await post.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

export const getCommentsOnMyPosts = async (req, res) => {
  try {
    const myPosts = await Post.find({ author: req.user.id });
    const postIds = myPosts.map(post => post._id);
    const comments = await Comment.find({ post: { $in: postIds } }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get comments on your posts' });
  }
};

export const getMyComments = async (req, res) => {
  try {
    const comments = await Comment.find({ commenter: req.user._id })
      .populate("post")  // ← populate post data
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get your comments' });
  }
};


export const getComments = async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get comments' });
  }
};
