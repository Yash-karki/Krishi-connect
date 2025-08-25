const express = require('express');
const router = express.Router();
const { createListing, myListings } = require('../controllers/wastecontroller');
const { authRequired } = require('../middlewares/authmiddleware');

router.post('/', authRequired, createListing);
router.get('/mine', authRequired, myListings);

module.exports = router;




