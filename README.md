# 🎓 Leave Management System — MERN Stack

A complete hierarchical leave approval system for educational institutions.

## 📋 Approval Flow

```
Student → Teacher → HOD → Principal → Final Decision
```

## 🏗️ Tech Stack

- **Frontend**: React.js (Vite) + Tailwind CSS + React Router + Axios
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: JWT (JSON Web Tokens) + bcryptjs

---

## 🚀 Quick Setup

### Prerequisites

- Node.js v18+ installed
- npm v9+ installed
- Internet connection (for MongoDB Atlas)

---

### Step 1 — Setup Backend

```bash
# Navigate to backend folder
cd leave-management-system/backend

# Install dependencies
npm install

# Seed demo users
npm run seed

# The .env file is already included with your MongoDB connection
# (Edit .env if you want to change the JWT secret)

# Start backend server
npm run dev
```

✅ Backend runs at: **http://localhost:5000**

---

### Step 2 — Setup Frontend

Open a **new terminal window** and run:

```bash
# Navigate to frontend folder
cd leave-management-system/frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

✅ Frontend runs at: **http://localhost:5173**

---

### Step 3 — Open in Browser

Go to: **http://localhost:5173**

---

## � Demo Credentials

Use these credentials to test different user roles:

| Role      | Email              | Password |
| --------- | ------------------ | -------- |
| Student   | student@demo.com   | demo123  |
| Teacher   | teacher@demo.com   | demo123  |
| HOD       | hod@demo.com       | demo123  |
| Principal | principal@demo.com | demo123  |

---

| Role          | Can Do                                                   |
| ------------- | -------------------------------------------------------- |
| **Student**   | Apply for leave, view own leave history                  |
| **Teacher**   | View pending leaves, approve/reject (1st level)          |
| **HOD**       | View teacher-approved leaves, approve/reject (2nd level) |
| **Principal** | View HOD-approved leaves, give final approval/rejection  |
| **Admin**     | View all leaves, see statistics — monitoring only        |

---

## 📌 API Endpoints

### Auth

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| POST   | `/api/auth/login` | Login & get JWT token |
| GET    | `/api/auth/me`    | Get current user      |

### Leaves

| Method | Endpoint                 | Access                      |
| ------ | ------------------------ | --------------------------- |
| POST   | `/api/leaves/apply`      | Student                     |
| GET    | `/api/leaves/my`         | Student                     |
| GET    | `/api/leaves/pending`    | Teacher/HOD/Principal/Admin |
| GET    | `/api/leaves/all`        | Admin only                  |
| GET    | `/api/leaves/stats`      | Admin only                  |
| PUT    | `/api/leaves/update/:id` | Teacher/HOD/Principal       |

---

## 🗂️ Project Structure

```
leave-management-system/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT auth + role check
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Leave.js           # Leave schema
│   ├── routes/
│   │   ├── authRoutes.js      # Register/Login
│   │   └── leaveRoutes.js     # Leave CRUD + approvals
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Express entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ApprovalDashboard.jsx  # Reusable for Teacher/HOD/Principal
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── StatusTimeline.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── HODDashboard.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── PrincipalDashboard.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   └── TeacherDashboard.jsx
    │   ├── services/
    │   │   └── api.js        # Axios instance + all API calls
    │   ├── App.jsx           # Routes + Protected routes
    │   ├── index.css         # Tailwind + custom styles
    │   └── main.jsx          # React entry point
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🔐 Status Lifecycle

```
pending
  → Teacher approves → teacher_approved
    → HOD approves   → hod_approved
      → Principal approves → approved (✅ FINAL)
  → Any level rejects → rejected (❌ FINAL)
```

---

## 📦 Dependencies

### Backend

- `express` — Web framework
- `mongoose` — MongoDB ODM
- `bcryptjs` — Password hashing
- `jsonwebtoken` — JWT auth
- `cors` — Cross-origin requests
- `dotenv` — Environment variables

### Frontend

- `react` + `react-dom` — UI framework
- `react-router-dom` — Client-side routing
- `axios` — HTTP client
- `react-hot-toast` — Toast notifications
- `tailwindcss` — Utility-first CSS

---

## 🛠️ Troubleshooting

**Backend not connecting to MongoDB?**

- Check your internet connection
- Verify the MongoDB Atlas cluster is active
- Ensure the IP is whitelisted (0.0.0.0/0 for all IPs)

**CORS errors in browser?**

- Ensure backend is running on port 5000
- Check `vite.config.js` proxy setting

**Token errors?**

- Clear localStorage in browser DevTools
- Re-login

---

## 📄 License

MIT — Free to use for educational purposes.
