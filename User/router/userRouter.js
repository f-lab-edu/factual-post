const express = require('express');
const userController = require('../Controller/userController');
const router = express.Router();

router.post('/sign-up', userController.signUp);

module.exports = router;