const express = require('express');
const commentRouter = express.Router();
const {addComment, removeComment} = require('../controllers/commentControllers');
const {checkAuthorization} = require('../middlewares/authorizationMiddleware');

// endpoint prefix : /comment

commentRouter.post('/add', checkAuthorization, addComment);
commentRouter.put('/remove', checkAuthorization, removeComment);

module.exports = {commentRouter};