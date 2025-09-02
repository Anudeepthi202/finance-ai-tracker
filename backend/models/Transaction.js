// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ✅ change to String
  description: String,
  amount: Number,
  category: String,
  type: String,
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
