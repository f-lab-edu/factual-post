const express = require('express');
const userController = require('../controller/userController');

module.exports = (authMiddleware) => {
    const router = express.Router();

    router.get('/', authMiddleware.fullfilled, userController.findAllUser);
    router.post('/sign-up', userController.signUp);
    router.post('/login', userController.login);

    return router;
};