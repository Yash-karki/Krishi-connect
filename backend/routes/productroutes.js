const express = require('express');
const router = express.Router();
const { listProducts, createProduct } = require('../controllers/productcontroller');
const { authRequired } = require('../middlewares/authmiddleware');

router.get('/', listProducts);
router.post('/', authRequired, createProduct);

module.exports = router;






