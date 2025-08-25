const express = require('express');
const router = express.Router();
const { createOrder, listOrders } = require('../controllers/ordercontroller');
const { authRequired } = require('../middlewares/authmiddleware');

router.post('/', authRequired, createOrder);
router.get('/', authRequired, listOrders);

module.exports = router;



