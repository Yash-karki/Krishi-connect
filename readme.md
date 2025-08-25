# KrishiConnect - Direct Farm to Consumer Platform

KrishiConnect is a comprehensive platform that connects farmers directly with consumers, eliminating middlemen and ensuring fair prices for both parties.

## Features

- **User Authentication**: Secure login/signup system with JWT tokens
- **Product Management**: Browse and search agricultural products
- **Order Management**: Place orders and track their status
- **Waste/Byproduct Sales**: Farmers can sell agricultural waste and byproducts
- **Dashboard**: Comprehensive overview of orders, products, and analytics
- **Responsive Design**: Modern, mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** authentication
- **bcrypt** password hashing
- **CORS** enabled

### Frontend
- **Vanilla JavaScript** (ES6+)
- **HTML5** with semantic markup
- **CSS3** with modern design principles
- **Responsive design** for all devices

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the backend directory:
   ```env
   # Database Configuration
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DB=KrishiConnect

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_in_production

   # Server Configuration
   PORT=3000
   ```

4. **Set up MySQL database:**
   - Create a MySQL database named `KrishiConnect`
   - Run the SQL commands from `backend/database-schema.sql`

5. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Open `index.html` in your browser** or serve it using a local server

3. **For development, you can use:**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get user profile (protected)

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product (protected)

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - List user orders (protected)

### Listings (Waste/Byproducts)
- `POST /api/listings` - Create new listing (protected)
- `GET /api/listings/mine` - Get user listings (protected)

## Database Schema

The application uses the following main tables:
- `users` - User accounts and authentication
- `products` - Agricultural products available for sale
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `listings` - Waste/byproduct listings

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the GitHub repository.
