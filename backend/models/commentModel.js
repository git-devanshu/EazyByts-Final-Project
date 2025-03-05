const mongoose = require('mongoose');
const {getCurrentDate} = require('../utils/helperFunctions');

const commentSchema = new mongoose.Schema({
    commentedBy : {type : mongoose.Schema.Types.ObjectId, ref : 'users'},
	commentDesc : {type : String, default : ''},
	commentDate : {type : String, default : getCurrentDate(1)}
});

const Comments = mongoose.model('comments', commentSchema, 'comments');

module.exports = {Comments};