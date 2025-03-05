const {Bookings} = require('../models/bookingModel');
const { Events } = require('../models/eventModel');
const {Users} = require('../models/userModel');
const { getCurrentDate } = require('../utils/helperFunctions');

// @desc   - get the data of all bookings done by a user
// @route  - GET /booking/data
// @access - Private
const getMyBookings = async (req, res) =>{
    try{
        const data = await Bookings.find({bookingBy : req.id}).populate('bookingFor').populate('bookingBy', 'username name _id');
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - get the data of all bookings for an event listed by a user
// @route  - GET /booking/data/:eventId
// @access - Private
const getEventBookings = async (req, res) =>{
    try{
        const eventId = req.params.eventId;
        const data = await Bookings.find({bookingFor : eventId}).populate('bookingBy', 'username name _id');
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - book tickets for an event
// @route  - POST /booking/tickets
// @access - Private
const bookEvents = async (req, res) =>{
    try{
        const {bookingFor, transactionId, totalCost, totalTicketsBooked} = req.body;
        const event = await Events.findById(bookingFor);
        if(!event){
            return res.status(404).json({ message : 'Event not found' });
        }
        
        const newBooking = await Bookings.create({
            bookingBy : req.id,
            bookingFor, 
            transactionId, 
            totalCost, 
            totalTicketsBooked
        });

        event.bookings.push(newBooking._id);
        await event.save();
        
        const userId = event.listedBy;
        const newNotification = {
            message : `You have a new bookings for the event ${event.eventName} by the ${req.username}.`,
            notificationDate : getCurrentDate(1),
            notificationTime : getCurrentDate(5),
        };
        const user = await Users.findById(userId);
        user.notifications.push(newNotification);
        await user.save();

        res.status(200).json({ message : 'Tickets Booked successfully' });
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

module.exports = {
    getMyBookings, 
    getEventBookings, 
    bookEvents
}