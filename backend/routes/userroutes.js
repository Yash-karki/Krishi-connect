const express = require('express');
const router = express.Router();
const { signup, login, me } = require('../controllers/usercontroller');
const { authRequired } = require('../middlewares/authmiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authRequired, me);

module.exports = router;

