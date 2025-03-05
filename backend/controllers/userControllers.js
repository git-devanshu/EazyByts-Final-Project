const {Users} = require('../models/userModel');

// @desc   - send a specific user's data
// @route  - GET /user/data
// @access - Private
const getUserData = async (req, res) =>{
    try{
        const data = await Users.findById(req.id).populate('bookmarks');
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - update a specific user's data
// @route  - PUT /user/update
// @access - Private
const updateUserData = async (req, res) =>{
    try{
        const {name, email} = req.body;
        const user = await Users.findByIdAndUpdate(req.id, {name, email}, {new : true});
        if(user){
            return res.status(200).json({ message : 'User updated successfully' });
        }
        res.status(404).json({ message : 'User not found' });
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

module.exports = {
    getUserData, 
    updateUserData
}