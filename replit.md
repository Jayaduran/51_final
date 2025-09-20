# Manufacturing Management Application

## Overview
This is a comprehensive Manufacturing Management Application built with React, TypeScript, and Vite. The application provides a complete solution for managing manufacturing operations including order management, inventory tracking, bill of materials (BOM), work centers, and user management.

## Recent Changes
- **2025-09-20**: Successfully imported and configured for Replit environment
- **2025-09-20**: Configured Vite to bind to 0.0.0.0:5000 for Replit proxy compatibility
- **2025-09-20**: Set up PostgreSQL database connection for backend (currently using demo data)
- **2025-09-20**: Configured deployment settings for autoscale deployment

## Project Architecture

### Frontend (React + TypeScript + Vite)
- **Location**: Root directory
- **Framework**: React 19.1.0 with TypeScript
- **Build System**: Vite 6.3.6
- **UI Library**: Tailwind CSS with Lucide React icons
- **Charts**: ECharts with echarts-for-react
- **Routing**: React Router DOM 7.9.1
- **State Management**: React Context API
- **Data Generation**: Faker.js for demo data

### Backend (Express + TypeScript + Prisma)
- **Location**: `backend/` directory
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT-based authentication
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Zod for schema validation

### Key Features
1. **Authentication System**: Login/signup with demo credentials (admin/admin123)
2. **Manufacturing Orders**: Create and manage production orders
3. **Work Orders**: Detailed work order management with operations tracking
4. **Bill of Materials (BOM)**: Product component management
5. **Inventory Management**: Stock tracking and movement records
6. **Work Centers**: Production facility management
7. **User Management**: Role-based access control
8. **Dashboard**: Real-time KPIs and production metrics

### Current Configuration
- **Frontend Port**: 5000 (configured for Replit proxy)
- **Backend Port**: 3001 (when running separately)
- **Database**: PostgreSQL (Replit hosted)
- **Development Mode**: Frontend only with demo data
- **Production Mode**: Combined frontend+backend on single port

### Development Workflow
- **Current Setup**: Frontend development server on port 5000
- **Demo Data**: Uses Faker.js to generate realistic manufacturing data
- **Authentication**: Local storage based with demo credentials
- **Backend Integration**: Ready but currently using frontend-only mode

### User Preferences
- Uses modern React patterns with functional components and hooks
- TypeScript for type safety throughout the application
- Tailwind CSS for styling with responsive design
- Component-based architecture with reusable UI elements

### Next Steps (if needed)
1. Connect frontend to backend API for real data
2. Set up user authentication via backend
3. Configure database migrations and seeding
4. Set up production deployment with both frontend and backend