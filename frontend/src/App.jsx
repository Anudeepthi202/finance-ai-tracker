import { useState, useEffect } from "react";
import "./index.css";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import axios from "axios";
import AddTransaction from "./components/AddTransaction.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Google login error:", error);
      alert("Login failed. Check console for details.");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setTransactions([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  
  // / Add new transaction
  const addTransaction = (transaction) => {
    setTransactions([...transactions, { id: Date.now(), ...transaction }]);
  };

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    if (!user) return;

    try {
      // Get Firebase ID token
      const token = await user.getIdToken();

      const res = await axios.get("http://localhost:5000/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(Array.isArray(res.data) ? res.data : []);
      console.log("Fetched transactions:", res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      setTransactions([]);
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  // Update transaction
  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t))
    );
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Finance AI Tracker</h1>

      {!user ? (
        <button
          onClick={handleGoogleLogin}
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-500 transition mb-8"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="flex items-center gap-4 mb-8">
          <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
          <span>{user.displayName}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
          >
            Logout
          </button>
        </div>
      )}

      {user && <AddTransaction fetchTransactions={fetchTransactions} user={user} />}

      {user && <Dashboard user={user} />}

      {user && transactions.length > 0 && (
        <div className="w-full max-w-md mt-8">
          <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
          <ul className="space-y-2">
            {transactions.map((t) => (
              <li key={t._id} className="p-3 bg-gray-800 rounded flex justify-between">
                <div>
                  <p>{t.description}</p>
                  <p className="text-gray-400 text-sm">
                    {t.category} - {t.amount} ({t.type})
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
