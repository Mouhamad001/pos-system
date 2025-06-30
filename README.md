# 🛒 POS System

A complete Point of Sale (POS) system built with React frontend and Node.js backend. This system provides a comprehensive solution for retail businesses to manage products, process orders, track inventory, and handle customer transactions.

![POS System](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, Cashier)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 📦 Product Management
- Add, edit, and delete products
- Product categorization
- Inventory tracking with stock levels
- Barcode support
- Product images and descriptions
- Cost price and selling price management

### 🏷️ Category Management
- Create and manage product categories
- Organize products efficiently
- Category-based filtering

### 🛍️ Order Processing
- Create and manage customer orders
- Real-time cart management
- Order history and tracking
- Receipt generation

### 📊 Inventory Control
- Real-time stock tracking
- Low stock alerts
- Stock adjustment capabilities
- Product availability management

### 👥 User Management
- Multiple user roles with different permissions
- User profile management
- Activity logging

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Beautiful, responsive UI components
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
pos-system/
├── 📁 frontend/              # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/    # Reusable UI components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── 📁 pages/         # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── Orders.tsx
│   │   │   └── POS.tsx
│   │   ├── 📁 features/      # Redux slices and API logic
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   └── cart/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── 📁 backend/               # Node.js backend API
│   ├── 📁 controllers/       # Route controllers
│   │   ├── productController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   └── categoryController.js
│   ├── 📁 middleware/        # Custom middleware
│   │   └── authMiddleware.js
│   ├── 📁 routes/           # API routes
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── orderRoutes.js
│   │   └── categoryRoutes.js
│   ├── 📁 models/           # Data models (mock database)
│   │   └── mockDb.js
│   ├── server.js
│   └── package.json
├── package.json             # Root package.json for scripts
├── run.sh                   # Quick start script
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/Mouhamad001/pos-system.git
cd pos-system
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=12001
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
```

4. **Start the application:**
```bash
# Option 1: Use the quick start script
./run.sh

# Option 2: Use npm script
npm start
```

The application will start:
- **Frontend**: http://localhost:12000
- **Backend API**: http://localhost:12001

### Manual Setup

If you prefer to start services individually:

```bash
# Start backend
cd backend
npm install
npm run dev

# Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## 👤 Default Users

The system comes with pre-configured test users:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@example.com | password123 | Full system access |
| **Manager** | manager@example.com | password123 | Product & order management |
| **Cashier** | cashier@example.com | password123 | POS operations only |

## 🔌 API Endpoints

### Authentication
```http
POST /api/users/login          # User login
POST /api/users/register       # User registration (Admin only)
GET  /api/users/profile        # Get user profile
```

### Products
```http
GET    /api/products           # Get all products
POST   /api/products           # Create product (Manager/Admin)
GET    /api/products/:id       # Get single product
PUT    /api/products/:id       # Update product (Manager/Admin)
DELETE /api/products/:id       # Delete product (Manager/Admin)
GET    /api/products/search    # Search products
```

### Categories
```http
GET    /api/categories         # Get all categories
POST   /api/categories         # Create category (Manager/Admin)
GET    /api/categories/:id     # Get single category
PUT    /api/categories/:id     # Update category (Manager/Admin)
DELETE /api/categories/:id     # Delete category (Manager/Admin)
```

### Orders
```http
GET    /api/orders             # Get all orders
POST   /api/orders             # Create order
GET    /api/orders/:id         # Get single order
PUT    /api/orders/:id         # Update order
DELETE /api/orders/:id         # Delete order
```

## 🎯 Usage Guide

### For Cashiers
1. **Login** with cashier credentials
2. **Access POS** interface
3. **Add products** to cart by scanning or searching
4. **Process payments** and generate receipts
5. **View order history**

### For Managers
1. **Manage products** - Add, edit, delete products
2. **Manage categories** - Organize product catalog
3. **Monitor inventory** - Track stock levels
4. **Process orders** - Handle customer transactions
5. **View reports** - Analyze sales data

### For Admins
1. **Full system access** - All manager permissions
2. **User management** - Create and manage user accounts
3. **System configuration** - Modify system settings
4. **Advanced reporting** - Access detailed analytics

## 🔧 Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
```

### Environment Configuration

#### Development
```env
NODE_ENV=development
PORT=12001
JWT_SECRET=development_secret_key
```

#### Production
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_production_secret_key
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure code passes linting

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check** the [Issues](https://github.com/Mouhamad001/pos-system/issues) page
2. **Create** a new issue if your problem isn't already reported
3. **Provide** detailed information about the issue

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **Redux Toolkit** for simplified state management
- **Vite** for the fast development experience
- **Express.js** for the robust backend framework

---

**Built with ❤️ by [Mouhamad Hassooun](https://github.com/Mouhamad001)**