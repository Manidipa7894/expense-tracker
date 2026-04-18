# SpendWise — Expense Tracker

A full-stack MERN expense tracker with income/expense management, category filtering, and visual analytics.

## Tech Stack

**Frontend:** React.js, Chart.js, Axios, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose ODM)

## Features

- Add, edit, delete income & expense transactions
- Category tagging (Food, Transport, Bills, Salary, etc.)
- Filter by type and category
- Dashboard with balance summary cards
- Bar chart (Income vs Expenses) and Doughnut chart (spending by category)
- Responsive design

## Project Structure

```
expense-tracker/
├── backend/
│   ├── models/Transaction.js
│   ├── routes/transactions.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── public/
    └── src/
        ├── pages/Dashboard.js
        ├── pages/Transactions.js
        ├── App.js
        └── api.js
```

## Setup & Run

### Prerequisites
- Node.js installed
- MongoDB running locally (or use MongoDB Atlas)

### Backend
```bash
cd backend
npm install
# Edit .env and set your MONGO_URI
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`  
API runs at `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | Get all transactions |
| POST | /api/transactions | Create transaction |
| PUT | /api/transactions/:id | Update transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/transactions/stats/summary | Get summary stats |
