import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend ,LineChart, Line, XAxis, YAxis, CartesianGrid} from "recharts";


const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // ✅ Fetch all transactions
  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await axios.get("http://localhost:5000/transactions/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // ✅ Delete transaction
  const handleDelete = async (id) => {
    try {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:5000/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  // ✅ Start editing
  const handleEdit = (tx) => {
    setEditId(tx._id);
    setNewDesc(tx.description);
    setNewAmount(tx.amount);
  };

  // ✅ Save update
  const handleUpdate = async (id) => {
    try {
      const token = await user.getIdToken();
      const res = await axios.put(
        `http://localhost:5000/transactions/${id}`,
        { description: newDesc, amount: parseFloat(newAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(
        transactions.map((tx) => (tx._id === id ? res.data : tx))
      );
      setEditId(null);
    } catch (error) {
      console.error("Failed to update transaction", error);
    }
  };

  // ✅ Chart data
  const chartData = transactions.map((t) => ({
    name: t.category || t.description,
    value: t.amount,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <ul className="mt-4">
            {transactions.map((tx) => (
              <li key={tx._id} className="border p-2 rounded mb-2">
                {editId === tx._id ? (
                  <>
                    <input
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="border p-1 mr-2"
                    />
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="border p-1 mr-2"
                    />
                    <button
                      onClick={() => handleUpdate(tx._id)}
                      className="bg-green-500 text-white px-2 py-1 mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 text-white px-2 py-1"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Description:</strong> {tx.description}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${tx.amount}
                    </p>
                    <p>
                      <strong>Category:</strong> {tx.category}
                    </p>
                    <p>
                      <strong>Type:</strong> {tx.type}
                    </p>
                    <button
                      onClick={() => handleEdit(tx)}
                      className="bg-yellow-500 text-white px-2 py-1 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="bg-red-500 text-white px-2 py-1"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* ✅ Pie Chart */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Spending Breakdown</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

{/* ✅ Line Chart for trends */}
<div className="mt-6">
  <h3 className="font-semibold mb-2">Spending Trends</h3>
  <LineChart width={500} height={300} data={transactions}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
  </LineChart>
</div>

        </>
      )}
    </div>
  );
};

export default Dashboard;
