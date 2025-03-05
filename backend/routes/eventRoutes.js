const express = require('express');
const eventRouter = express.Router();
const {getAllEvents, getMyEvents, getAnEvent, addEvent, removeEvent, updateEvent, addBookmark, removeBookmark} = require('../controllers/eventControllers');
const {checkAuthorization} = require('../middlewares/authorizationMiddleware');

// endpoint prefix : /event

eventRouter.get('/data', checkAuthorization, getAllEvents);
eventRouter.get('/data/:eventId', checkAuthorization, getAnEvent);
eventRouter.get('/my-data', checkAuthorization, getMyEvents);
eventRouter.post('/add', checkAuthorization, addEvent);
eventRouter.delete('/remove/:eventId', checkAuthorization, removeEvent);
eventRouter.put('/update', checkAuthorization, updateEvent);
eventRouter.put('/bookmark', checkAuthorization, addBookmark);
eventRouter.put('/remove-bookmark', checkAuthorization, removeBookmark);

module.exports = {eventRouter};