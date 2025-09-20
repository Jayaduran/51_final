# Manufacturing Management Backend API

A robust Node.js/Express backend API for the Manufacturing Management Application, built with TypeScript, Prisma ORM, and SQLite/PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Manufacturing Management**: Complete CRUD operations for manufacturing orders
- **Product Management**: Product catalog with inventory tracking
- **Work Order Management**: Production workflow management
- **BOM (Bill of Materials)**: Component management and costing
- **Stock Management**: Inventory tracking and movements
- **Work Center Management**: Production capacity and utilization
- **User Management**: Role-based user administration
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Prisma client setup
│   │   └── env.ts        # Environment validation
│   ├── controllers/      # Route controllers
│   │   ├── authController.ts
│   │   ├── manufacturingController.ts
│   │   └── productController.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # Authentication middleware
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/          # API routes
│   │   ├── authRoutes.ts
│   │   ├── manufacturingRoutes.ts
│   │   └── productRoutes.ts
│   ├── services/         # Business logic
│   │   ├── authService.ts
│   │   ├── manufacturingService.ts
│   │   └── productService.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── validators/       # Request validation schemas
│   │   ├── authValidators.ts
│   │   └── manufacturingValidators.ts
│   └── server.ts        # Main server file
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="file:./dev.db"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d
   FRONTEND_URL=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   BCRYPT_ROUNDS=12
   ```

4. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |

### Manufacturing Orders Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/manufacturing-orders` | Get all orders (paginated) | Yes |
| GET | `/api/manufacturing-orders/stats` | Get order statistics | Yes |
| GET | `/api/manufacturing-orders/:id` | Get order by ID | Yes |
| POST | `/api/manufacturing-orders` | Create new order | Manager+ |
| PUT | `/api/manufacturing-orders/:id` | Update order | Manager+ |
| DELETE | `/api/manufacturing-orders/:id` | Delete order | Manager+ |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products (paginated) | Yes |
| GET | `/api/products/low-stock` | Get low stock products | Yes |
| GET | `/api/products/:id` | Get product by ID | Yes |
| POST | `/api/products` | Create new product | Manager+ |
| PUT | `/api/products/:id` | Update product | Manager+ |
| DELETE | `/api/products/:id` | Delete product | Manager+ |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **ADMIN**: Full access to all features
- **MANAGER**: Can manage orders, products, and users
- **OPERATOR**: Can view and update orders
- **INVENTORY**: Can manage stock and products

## 🗄️ Database

### Development (SQLite)
- File-based database (`dev.db`)
- No additional setup required
- Perfect for development and testing

### Production (PostgreSQL/MySQL)
Update the `DATABASE_URL` in your environment:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/manufacturing_db"
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Build for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="your-production-secret-key"
FRONTEND_URL="https://your-frontend-domain.com"
```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🔧 Configuration

### Rate Limiting
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

### CORS
- Configured for frontend URL
- Credentials enabled for authentication

### Security Headers
- Helmet.js for security headers
- Input validation with Zod
- SQL injection protection via Prisma

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the example requests in the seed data
