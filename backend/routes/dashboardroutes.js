const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardcontrollers');
const { authRequired } = require('../middlewares/authmiddleware');

router.get('/', authRequired, getDashboard);

module.exports = router;
