const {Comments} = require('../models/commentModel');
const { Events } = require('../models/eventModel');
const { Users } = require('../models/userModel');
const { getCurrentDate } = require('../utils/helperFunctions');

// @desc   - add new comment on an event
// @route  - POST /comment/add
// @access - Private
const addComment = async (req, res) =>{
    try{
        const {eventId, commentDesc} = req.body;
        const event = await Events.findById(eventId);
        if(!event){
            return res.status(404).json({ message : 'Event not found' });
        }
        
        const newComment = await Comments.create({
            commentedBy : req.id,
            commentDesc
        });

        event.comments.push(newComment._id);
        await event.save();

        const newNotification = {
            message : `${req.username} commented on your event ${event.eventName}`,
            notificationDate : getCurrentDate(1),
            notificationTime : getCurrentDate(5),
        }

        const userId = event.listedBy;
        const user = await Users.findById(userId);
        user.notifications.push(newNotification);
        await user.save();

        res.status(200).json({ message : 'Comment added successfully' });
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - remove the comment added by a user
// @route  - PUT /comment/remove
// @access - Private
const removeComment = async (req, res) =>{
    try{
        const {commentId, eventId} = req.body;
        const comment = await Comments.findById(commentId);
        if(!comment){
            return res.status(404).json({ message : 'Comment not found' });
        }

        if(comment.commentedBy.toString() == req.id){
            const event = await Events.findById(eventId);
            event.comments = event.comments.filter((id)=> id.toString() != commentId);
            await event.save();

            await Comments.deleteOne({_id : commentId});
            return res.status(200).json({ message : 'Comment removed successfully' });
        }
        res.status(400).json({ message : 'Comment is made by another user' });
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

module.exports = {
    addComment,
    removeComment
}