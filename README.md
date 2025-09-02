📊 Finance AI Tracker

A personal finance tracking app that helps users log transactions, visualize spending trends, and manage their budget. Originally designed to use AI-powered parsing (OpenAI API), but since the API key quota is over, the app now works with manual data entry + mock data.

🚀 Features
🔑 Authentication

Google Login (via Firebase/Google OAuth).

Logout button in the navbar.

💰 Transactions (CRUD)

Add Transaction: Users manually enter a description + amount.

Update Transaction: Edit any existing transaction.

Delete Transaction: Remove unwanted transactions.

Data is stored in the backend (/backend → Express + MongoDB).

📊 Data Visualization

Pie Chart: Shows spending categories (mock-categorized transactions).

Line Chart: Shows spending over time.

Bar Chart (optional): Monthly totals.

(All charts implemented using Recharts
).

🛠 Tech Stack

Frontend: React + TailwindCSS + Recharts

Backend: Node.js + Express

Database: MongoDB (local/Atlas)

Auth: Google OAuth

Deployment: Vercel (frontend) + Render/Heroku (backend)

📦 Installation
# Clone repo
git clone https://github.com/Anudeepthi202/finance-ai-tracker.git
cd finance-ai-tracker

# Setup frontend
cd frontend
npm install
npm start

# Setup backend
cd ../backend
npm install
npm run dev

🔄 How It Works

User logs in with Google.

User can add transactions manually (e.g., "Coffee 50").

Earlier: OpenAI API parsed text like "Bought coffee for ₹50".

Now: Only manual entry + mock category tagging.

Transactions are saved in MongoDB.

Charts are updated dynamically:

Pie Chart: Spending by category.

Line Chart: Spending trend over time.

Users can update or delete old transactions.

📂 Project Structure
finance-ai-tracker/
├── frontend/   # React app
│   ├── src/components/
│   │   ├── AddTransaction.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Charts.jsx
│   │   └── Login.jsx
│   └── ...
├── backend/    # Express + MongoDB API
│   ├── models/Transaction.js
│   ├── routes/transactions.js
│   └── server.js
├── docs/       # Documentation + screenshots
│   └── README.md
├── .env.example
├── package.json
└── README.md   # Main setup guide

📸 Screenshots 

Login page with Google auth.

<img width="1920" height="1080" alt="Screenshot (736)" src="https://github.com/user-attachments/assets/3ad5c082-a525-4ab4-b755-5a19f9e461f2" />

Add Transaction form.

<img width="1920" height="1080" alt="Screenshot (737)" src="https://github.com/user-attachments/assets/1795fc62-56bc-4407-92d5-0df297653e35" />

Dashboard showing list of transactions.

<img width="1920" height="1080" alt="Screenshot (737)" src="https://github.com/user-attachments/assets/43340a26-13a5-4a8e-bd7e-b19b7132da81" />

Charts (Pie + Line).
<img width="1920" height="1080" alt="Screenshot (738)" src="https://github.com/user-attachments/assets/26331d56-9a59-4798-8014-cece53664691" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/15228dad-318d-4f10-b451-cfb2f19a1f7a" />

