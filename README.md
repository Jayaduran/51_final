Here’s a **cleaned-up and customized** `README.md` draft based on your instructions:

````markdown
# Odoo X NMIT – Hackathon Project 🚀

We proudly participated in the **Odoo X NMIT Hackathon** with our project **Manufacturing Management Application** –  
a full-stack solution to streamline manufacturing operations with **real-time KPIs, auto-generated order tracking, and a single-port deployment** for production.

🎥 **Project Presentation Video Links:**  
[▶️ Watch Presentation – Link 1](https://drive.google.com/file/d/1bTgbwGyY53Sa9Cjn6znq_g4Xai0yN5jd/view?usp=drivesdk)  
[▶️ Watch Presentation – Link 2](https://drive.google.com/file/d/1aNvuxeJC6AxvoKyI8iGrKMv45Yo-7SJq/view?usp=drivesdk)

---

## 🏭 Project Overview
A **manufacturing management system** that enables:
- 📦 **Auto-generated Manufacturing Orders** with unique codes  
- 🔄 **Status Workflow**: draft → confirmed → in-progress → completed  
- 📊 **Real-time Dashboard** with key production metrics  
- 🔐 **Secure Authentication** using JWT tokens  
- 🌐 **Single-Port Production Deployment** for easier hosting

---

## 🚀 Quick Start (Single-Port Production)

### 1️⃣ Install Dependencies
```bash
npm install
cd backend && npm install
````

### 2️⃣ Configure Environment Variables

Create or edit the file: `backend/.env`

```env
PORT=5001
FRONTEND_URL=http://localhost:5001
JWT_SECRET=your_very_long_secret_key_32chars_min
DATABASE_URL="file:./dev.db"
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### 3️⃣ Build & Start

```bash
npm run build         # Build frontend
cd backend && npm run build   # Build backend
NODE_ENV=production npm run start
```

➡️ Access the app at: **[http://localhost:5001](http://localhost:5001)**

---

## 🧰 Tech Stack

* **Frontend**: React, Vite, Tailwind CSS
* **Backend**: Node.js, Express, Prisma ORM
* **Database**: SQLite (default, easily configurable)
* **Auth**: JWT (access + refresh tokens)

---

## 📡 Core API Endpoints

| Endpoint                        | Method | Description                    |
| ------------------------------- | ------ | ------------------------------ |
| `/api/manufacturing-orders`     | GET    | Get all manufacturing orders   |
| `/api/manufacturing-orders`     | POST   | Create new manufacturing order |
| `/api/manufacturing-orders/:id` | PUT    | Update a specific order        |
| `/api/manufacturing-orders/:id` | DELETE | Delete a manufacturing order   |

---

## 💡 Troubleshooting

| Issue                          | Fix                                        |
| ------------------------------ | ------------------------------------------ |
| ❌ Blank Page on Load           | Ensure frontend is built & backend started |
| 🔁 Port Conflict               | Change `PORT` in `backend/.env`            |
| 🔐 Auth Issues / Token Expired | Check token refresh configuration          |
| 🔎 Database Connection Error   | Verify `DATABASE_URL` in `.env`            |

---

## 📄 License

MIT License

```

---

Would you like me to generate a **downloadable `README.md` file** with this exact content?
```
