const mongoose = require('mongoose');
const {getCurrentDate} = require('../utils/helperFunctions');

const bookingSchema = new mongoose.Schema({
	bookingFor : {type : mongoose.Schema.Types.ObjectId, ref : 'events'},
	bookingBy  : {type : mongoose.Schema.Types.ObjectId, ref : 'users'},
	transactionId : {type : String, default : ''},
	totalCost : {type : Number, default : 0},
	totalTicketsBooked : {type : Number, default : 0},
    bookingDate : {type : String, default : getCurrentDate(1)}
});

const Bookings = mongoose.model('bookings', bookingSchema, 'bookings');

module.exports = {Bookings};