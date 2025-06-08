//models//post.js
import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  content: String,
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.model("Post", postSchema);
