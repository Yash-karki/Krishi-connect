const express = require('express');
const router = express.Router();
const { createListing, myListings, deleteListing } = require('../controllers/wastecontroller');
const { authRequired } = require('../middlewares/authmiddleware');

router.post('/', authRequired, createListing);
router.get('/me', authRequired, myListings);
router.delete('/:id', authRequired, deleteListing);

module.exports = router;
