# 🔐 Authentication Setup Guide

## Prerequisites
- MySQL server running
- Node.js installed
- All dependencies installed (`npm install`)

## Step 1: Create Environment File

Create a `.env` file in the `backend` directory with the following content:

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DB=krishiconnect

# JWT Configuration (IMPORTANT: Change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters

# Server Configuration
PORT=3000

# Optional: Node Environment
NODE_ENV=development
```

## Step 2: Generate a Secure JWT Secret

Replace `your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters` with a secure random string. You can generate one using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Set Up Database

1. Make sure MySQL is running
2. Create the database:
   ```sql
   CREATE DATABASE krishiconnect;
   ```
3. Run the setup script:
   ```bash
   node setup-database.js
   ```

## Step 4: Start the Server

```bash
npm start
```

## Step 5: Test Authentication

1. Open `http://localhost:3000` in your browser
2. Navigate to the signup page
3. Create a new account
4. Try logging in and out

## 🔧 Troubleshooting

### "JWT_SECRET not configured" Error
- Make sure you created the `.env` file
- Check that `JWT_SECRET` is set in the `.env` file
- Restart the server after creating the `.env` file

### "Access denied for user" Error
- Check your MySQL credentials in the `.env` file
- Make sure MySQL is running
- Verify the database exists

### "Table doesn't exist" Error
- Run the database setup script: `node setup-database.js`
- Check that all tables were created successfully

### Frontend Authentication Issues
- Check browser console for errors
- Make sure you're accessing the site through `http://localhost:3000`
- Clear browser localStorage if needed

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use a strong, unique JWT_SECRET
- Keep your MySQL password secure
- Consider using environment-specific configurations for production

## 📁 File Structure

```
backend/
├── .env                    # Environment variables (create this)
├── config/
│   └── db.js              # Database connection
├── controllers/
│   └── usercontroller.js  # Authentication logic
├── middlewares/
│   └── authmiddleware.js  # JWT verification
└── routes/
    └── userroutes.js      # Authentication routes
```

## 🚀 Next Steps

After setting up authentication:
1. Test user registration and login
2. Verify protected pages require authentication
3. Check that logout works correctly
4. Test token expiration handling

