
````markdown
 Odoo X NMIT Hackathon 🚀

# 🏭 Manufacturing Management Application 

We proudly participated in the **Odoo X NMIT Hackathon** with our project **Manufacturing Management Application** –  
a full-stack solution to streamline manufacturing operations with **real-time KPIs, auto-generated order tracking, and a single-port deployment** for production.

---

## 📌 Project Overview

A modern **manufacturing management system** designed to:

- 📦 **Auto-generate Manufacturing Orders** with unique codes  
- 🔄 Manage **status workflows**: `draft → confirmed → in-progress → completed`  
- 📊 View **real-time dashboards** with key KPIs and analytics  
- 🔐 Ensure **secure user authentication** with JWT  
- 🌐 Enable **single-port deployment** (backend serves the frontend) for seamless hosting

---

## ✨ Features

- 🧾 Auto-generated Manufacturing Orders  
- 🔁 Status Workflow Management  
- 📈 Live Dashboard with KPIs  
- 🔒 JWT-based Authentication  
- ⚙️ RESTful APIs  
- 🖥️ Frontend + Backend served on a single port

---

## 🚀 Quick Start (Single-Port Production)

Follow these steps to set up and run the app locally or on a server:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
````

### 2️⃣ Install Dependencies

```bash
# Install frontend dependencies
npm install

# Navigate to backend and install backend dependencies
cd backend
npm install
```

### 3️⃣ Create a `.env` File

In the `backend/` directory, create a `.env` file with the following variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/your-db-name
```

> ✅ Replace `your_jwt_secret` and `your-db-name` with your own values.

### 4️⃣ Build the Frontend

```bash
# Go back to root directory
cd ..

# Build frontend for production
npm run build
```

This creates a `build/` folder that the backend will serve.

### 5️⃣ Start the Application

```bash
# Start backend (serves frontend + API)
cd backend
npm start
```

The app will be available at:
👉 `http://localhost:3000`

---

## 🐳 Optional: Docker Deployment

You can also deploy the app using Docker.

### 🛠️ Build & Run with Docker

```bash
# Build the image
docker build -t manufacturing-app .

# Run the container
docker run -p 3000:3000 --env-file ./backend/.env manufacturing-app
```

---

## ⚙️ Tech Stack

| Layer         | Technology              |
| ------------- | ----------------------- |
| 🖼️ Frontend  | React.js                |
| ⚙️ Backend    | Node.js, Express        |
| 🛢️ Database  | MongoDB                 |
| 🔐 Auth       | JWT (JSON Web Tokens)   |
| 📦 Deployment | Single-port via Express |

---

## 🔌 API Overview

### 🔐 Auth Routes

* `POST /api/auth/register` – Register a new user
* `POST /api/auth/login` – Login and receive JWT token

### 📦 Manufacturing Order Routes

* `GET /api/orders` – Get all orders
* `POST /api/orders` – Create a new order
* `PUT /api/orders/:id/status` – Update order status
* `DELETE /api/orders/:id` – Delete an order

> 🔐 All protected routes require a valid JWT in the `Authorization` header.

---

> 🙌 Special thanks to **Odoo** and **NMIT** for hosting the hackathon!

---
