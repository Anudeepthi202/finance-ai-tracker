// backend/routes/transactionRoutes.js
import express from "express";
import Transaction from "../models/Transaction.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // ✅ use named import
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// ----------------------------
// Local AI-free parser function
// ----------------------------
function parseTransaction(text) {
  const amountMatch = text.match(/\$?(\d+(\.\d+)?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

  let category = "Other";
  if (/coffee|restaurant|food|pizza|starbucks/i.test(text)) category = "Food";
  else if (/gas|fuel|petrol/i.test(text)) category = "Gas";
  else if (/salary|income|paid/i.test(text)) category = "Income";
  else if (/electronics|phone|laptop|watch/i.test(text)) category = "Electronics";

  const type = /income|salary|paid/i.test(text) ? "income" : "expense";

  return { amount, category, description: text, type };
}

// ----------------------------
// Parse natural language transaction
// ----------------------------
router.post("/parse", verifyToken, (req, res) => {
  try {
    const { text } = req.body;
    const parsed = parseTransaction(text);
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse transaction" });
  }
});

// ----------------------------
// Create a new transaction
// ----------------------------
router.post("/", verifyToken, async (req, res) => {
  try {
    const { description, amount, category, type } = req.body;
    const transaction = await Transaction.create({
      userId: req.user.uid, // ✅ Firebase UID
      description,
      amount,
      category,
      type,
    });
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// ----------------------------
// Get all transactions for user
// ----------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.uid });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

export default router;

// ✅ Update transaction
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete transaction
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
