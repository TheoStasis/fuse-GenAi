import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Links to your teammate's User model
    required: true 
  },
  topic: { type: String, required: true },
  interest: { type: String, required: true },
  // We store the entire result object so we can show the cards again
  result: { type: Object, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.History || mongoose.model("History", HistorySchema);

