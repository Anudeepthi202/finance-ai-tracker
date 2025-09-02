import express from "express";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Financial summary: income, expenses, savings
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const savings = income - expenses;
    res.json({ income, expenses, savings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get summary" });
  }
});

// Spending by category
router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    const categories = {};
    transactions.forEach(t => {
      if (!categories[t.category]) categories[t.category] = 0;
      categories[t.category] += t.amount;
    });
    const result = Object.keys(categories).map(cat => ({
      category: cat,
      amount: categories[cat],
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get categories" });
  }
});

export default router;
