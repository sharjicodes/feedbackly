//post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
