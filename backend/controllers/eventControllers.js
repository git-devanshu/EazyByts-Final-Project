const {Events} = require('../models/eventModel');
const { Users } = require('../models/userModel');

// @desc   - get the data for all events listed
// @route  - GET /event/data
// @access - Private
const getAllEvents = async (req, res) =>{
    try{
        const data = await Events.find({})
        .populate({
            path: 'comments',
            populate: {
                path: 'commentedBy', 
                select: 'username name _id'
            }
        })
        .populate('listedBy', 'username name _id');
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - get the data for a specific event listed
// @route  - GET /event/data/:eventId
// @access - Private
const getAnEvent = async (req, res) =>{
    try{
        const eventId = req.params.eventId;
        const data = await Events.findById(eventId)
        .populate({
            path: 'comments',
            populate: {
                path: 'commentedBy', 
                select: 'username name _id'
            }
        })
        .populate('listedBy', 'username name _id');
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - get the data of events added by specific user
// @route  - GET /event/my-data
// @access - Private
const getMyEvents = async (req, res) =>{
    try{
        const data = await Events.find({listedBy : req.id})
        .populate({
            path: 'comments',
            populate: {
                path: 'commentedBy', 
                select: 'username name _id'
            }
        })
        .populate('bookings');
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - add a new event to the event list
// @route  - POST /event/add
// @access - Private
const addEvent = async (req, res) =>{
    try{
        const {eventName, eventDate, eventLocation, ticketFare, eventPosterURL, eventDescription, specialNotes, paymentQrURL} = req.body;
        const newEvent = new Events({
            listedBy : req.id,
            eventName,
            eventDate, 
            eventLocation, 
            ticketFare, 
            eventPosterURL, 
            eventDescription, 
            specialNotes, 
            paymentQrURL
        });
        await newEvent.save();
        res.status(200).json({ message : 'New event added' });
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - remove an event added by a user
// @route  - DELETE /event/remove/:eventId
// @access - Private
const removeEvent = async (req, res) =>{
    try{
        const eventId = req.params.eventId;
        const event = await Events.findById(eventId);
        if(!event){
            return res.status(404).json({ message : 'Event not found' });
        }
        if(event.listedBy.toString() == req.id){
            await Events.deleteOne({_id : eventId});
            return res.status(200).json({ message : 'Event removed successfully' });
        }
        res.status(400).json({ message : 'Event is added by another user' });
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - update the data of an event added by a user
// @route  - PUT /event/update
// @access - Private
const updateEvent = async (req, res) =>{
    try{
        const {eventId, eventName, eventLocation, ticketFare, eventPosterURL, eventDescription, specialNotes, paymentQrURL} = req.body;
        const event = await Events.findByIdAndUpdate(eventId, {eventName, eventLocation, ticketFare, eventPosterURL, eventDescription, specialNotes, paymentQrURL}, {new : true});
        if(event){
            return res.status(200).json({ message : 'Event updated successfully' });
        }
        res.status(404).json({ message : 'Event not found' });
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - add an event into bookmarks
// @route  - PUT /event/bookmark
// @access - Private
const addBookmark = async (req, res) =>{
    try{
        const {eventId} = req.body;
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : 'User not found' });
        }

        const isAdded = user.bookmarks.some((id)=> id.toString() == eventId);
        if(isAdded){
            return res.status(400).json({ message : 'Event already bookmarked' });
        }

        user.bookmarks.push(eventId);
        await user.save();

        res.status(200).json({ message : 'Bookmark added' });
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - remove an event from bookmarks
// @route  - PUT /event/remove-bookmark
// @access - Private
const removeBookmark = async (req, res) =>{
    try{
        const {eventId} = req.body;
        const user = await Users.findById(req.id);
        if(!user){
            return res.status(404).json({ message : 'User not found' });
        }

        const isAdded = user.bookmarks.some((id)=> id.toString() == eventId);
        if(isAdded){
            user.bookmarks = user.bookmarks.filter((id) => id.toString() != eventId);
            await user.save();
        }
        
        res.status(200).json({ message : 'Bookmark removed' });
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

module.exports = {
    getAllEvents,
    getAnEvent, 
    getMyEvents, 
    addEvent, 
    removeEvent, 
    updateEvent,
    addBookmark,
    removeBookmark
}