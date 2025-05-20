// models/Chat.mjs
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  ai: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ❗ faqat bitta marta e’lon qilish kerak
export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
