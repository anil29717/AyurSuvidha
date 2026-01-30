import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: String, enum: ['user', 'bot'], required: true },
  content: { type: String, required: true },
  citations: [{
    source: String,
    relevance_score: Number,
    chunk_index: Number
  }],
  timestamp: { type: Date, default: Date.now },
  sessionId: { type: String } // For grouping sessions if needed
});

export const Message = mongoose.model('Message', messageSchema);
