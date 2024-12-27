const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { authJWT } = require('../../Auth/authJWT');

router.get('/', authJWT, userController.findAllUser);
router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);

module.exports = router;