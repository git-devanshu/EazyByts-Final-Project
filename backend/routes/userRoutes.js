const express = require('express');
const userRouter = express.Router();
const {getUserData, updateUserData} = require('../controllers/userControllers');
const {checkAuthorization} = require('../middlewares/authorizationMiddleware');

// endpoint prefix : /user

userRouter.get('/data', checkAuthorization, getUserData);
userRouter.put('/update', checkAuthorization, updateUserData);

module.exports = {userRouter};