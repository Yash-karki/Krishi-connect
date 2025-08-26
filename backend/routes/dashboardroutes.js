const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { authRequired } = require('../middlewares/authmiddleware');

router.get('/', authRequired, getDashboard);

module.exports = router;
