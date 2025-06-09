import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Normalize emails
      trim: true,
    },
    password: { type: String, required: true },
    isEmailValid: { type: Boolean, default: false }, // Optional for Mailboxlayer
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
