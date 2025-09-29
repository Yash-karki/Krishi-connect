const express = require('express');
const router = express.Router();
const { createOrder, listOrders, cancelOrder } = require('../controllers/ordercontroller');
const { authRequired } = require('../middlewares/authmiddleware');

router.post('/', authRequired, createOrder);
router.get('/', authRequired, listOrders);
router.put('/:id/cancel', authRequired, cancelOrder);

module.exports = router;









