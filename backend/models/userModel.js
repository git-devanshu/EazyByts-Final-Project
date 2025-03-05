const mongoose = require('mongoose');
const {getCurrentDate} = require('../utils/helperFunctions');

const userSchema = new mongoose.Schema({
	username : {type : String, required : true}, 
	name  : {type : String, default : ''}, 
	email : {type : String, required : true}, 
	password : {type : String, required : true}, 
	vfcode : {type : String, default : '0'}, 
	bookmarks : [{type : mongoose.Schema.Types.ObjectId, ref : 'events'}],
	notifications : {type : Array, default : []},
	registeredOn : {type : String, default : getCurrentDate(1)}
});

const Users = mongoose.model('users', userSchema, 'users');

module.exports = {Users};

/*

notification object
{
	message,
	notificationDate,
	notificationTime,
}

*/