
# Manufacturing Management Application – Single-Port Setup

## Quick Start (Production, Single-Port)

1. **Install dependencies**
    ```sh
    npm install
    cd backend && npm install
    ```

2. **Configure environment variables**
    - Edit `backend/.env` as needed. Ensure at least:
      ```env
      PORT=5001
      FRONTEND_URL=http://localhost:5001
      JWT_SECRET=your_very_long_secret_key_32chars_min
      DATABASE_URL="file:./dev.db"
      JWT_EXPIRES_IN=1h
      JWT_REFRESH_EXPIRES_IN=7d
      ```

3. **Build the frontend**
    ```sh
    npm run build
    ```
    This creates the production React build in `dist/`.

4. **Build the backend**
    ```sh
    cd backend
    npm run build
    ```

5. **Run the backend in production mode (serves frontend and API on one port)**
    ```sh
    NODE_ENV=production npm run start
    ```
    The app will be available at `http://localhost:5001` (or your configured port).

## Development (Separate Ports)

For development, you can run frontend and backend separately:

1. In project root:
    ```sh
    npm run dev
    ```
2. In `backend/`:
    ```sh
    npm run dev
    ```

## Features
- Auto-Generated Manufacturing Order tab with automatic order code and status workflow
- Dashboard with real-time KPIs (Total Orders, Pending Orders, Stock Levels, Production Efficiency)
- Full CRUD APIs for manufacturing orders
- Single-port deployment for easy hosting

## API Endpoints
- All API endpoints are available under `/api/` (e.g., `/api/manufacturing-orders`)

## Troubleshooting
- If you see a blank page, ensure you built the frontend and started the backend in production mode.
- If port conflicts occur, change the `PORT` in `backend/.env` and restart the server.

---
This project was generated through Alpha. For more information, visit [dualite.dev](https://dualite.dev).