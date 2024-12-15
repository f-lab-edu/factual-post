const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.get('/', userController.getUser);

module.exports = router;