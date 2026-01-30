import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  healthGoals: [{ type: String }],
  dosha: {
    primary: { type: String },
    secondary: { type: String },
    score: { type: Map, of: Number }
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);
