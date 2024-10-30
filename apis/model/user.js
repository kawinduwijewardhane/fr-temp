import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: false },
  socialLinks: { type: [String], required: false },
  videoLinks: { type: [String], required: false },
  bio: { type: String, required: false },
  profileImage: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
