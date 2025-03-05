const express = require('express');
const bookingRouter = express.Router();
const {getMyBookings, getEventBookings, bookEvents} = require('../controllers/bookingControllers');
const {checkAuthorization} = require('../middlewares/authorizationMiddleware');

// endpoint prefix : /booking

bookingRouter.get('/data', checkAuthorization, getMyBookings);
bookingRouter.get('/data/:eventId', checkAuthorization, getEventBookings);
bookingRouter.post('/tickets', checkAuthorization, bookEvents);

module.exports = {bookingRouter};