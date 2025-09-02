import React, { useState } from "react";
import axios from "axios";

// ✅ Accept 'user' as prop
const AddTransaction = ({ user, onTransactionAdded }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text) return;

    // ✅ Check if user exists
    if (!user) {
      alert("User not logged in!");
      return;
    }

    setLoading(true);
    try {
      // ✅ Get Firebase token
      const token = await user.getIdToken();

      // 1️⃣ Parse transaction via backend
      const parseResponse = await axios.post(
        "http://localhost:5000/transactions/parse",
        { text },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ use 'token'
      );

      const parsedTransaction = parseResponse.data;

      // 2️⃣ Save parsed transaction to DB
      const saveResponse = await axios.post(
        "http://localhost:5000/transactions/",
        parsedTransaction,
        { headers: { Authorization: `Bearer ${token}` } } // ✅ use 'token'
      );

      setText(""); // ✅ Clear input
      if (onTransactionAdded) onTransactionAdded(saveResponse.data); // ✅ Notify Dashboard
    } catch (error) {
      console.error("Failed to add transaction", error);
      alert("Error adding transaction. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAdd}
      className="flex flex-col gap-2 p-4 bg-white rounded shadow"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter transaction (e.g. Coffee $5)"
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
};

export default AddTransaction;
