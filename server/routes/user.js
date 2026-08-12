const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', auth.verify, userController.getProfile);
router.put('/profile', auth.verify, userController.updateProfile);

module.exports = router;
