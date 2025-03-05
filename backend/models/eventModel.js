const mongoose = require('mongoose');
const {getCurrentDate} = require('../utils/helperFunctions');

const eventSchema = new mongoose.Schema({
    listedBy : {type : mongoose.Schema.Types.ObjectId, ref : 'users'},
	eventName : {type : String, default : ''},
	eventDate : {type : String, default : ''},
	eventLocation : {type : String, default : ''},
	ticketFare : {type : Number, default : 0},
	eventPosterURL : {type : String, default : ''},
	eventDescription : {type : String, default : ''},
	specialNotes : {type : String, default : ''},
	paymentQrURL : {type : String, default : ''},
	bookings : [{type : mongoose.Schema.Types.ObjectId, ref : 'bookings'}],
	comments : [{type : mongoose.Schema.Types.ObjectId, ref : 'comments'}],
	listingDate : {type : String, default : getCurrentDate(1)}
});

const Events = mongoose.model('events', eventSchema, 'events');

module.exports = {Events};