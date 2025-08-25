const express = require("express");
const path = require("path");
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { initOraclePool } = require('./config/db');

const userRoutes = require('./routes/userroutes');
const productRoutes = require('./routes/productroutes');
const orderRoutes = require('./routes/orderroutes');
const wasteRoutes = require('./routes/wasteroutes');

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/* ---------- Static Frontend ---------- */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ---------- API Routes ---------- */
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/listings', wasteRoutes);

/* ---------- Auth-gated static redirects ---------- */
// Basic gate for buttons: frontend will check token; server serves pages.
// If you need server-side gating for specific pages, add a middleware that checks Authorization header and redirects.

/* ---------- Start ---------- */
const PORT = process.env.PORT || 3000;
initOraclePool()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error('Oracle pool init failed', e);
    process.exit(1);
  });
