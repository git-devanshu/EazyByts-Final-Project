const {Users} = require('../models/userModel');
const bcrypt = require('bcryptjs');
const {sendSignupMail, sendVFCodeMail, generateVerificationCode} = require('../utils/helperFunctions');
const jwt = require('jsonwebtoken');

// @desc   - register new user and send signup mail
// @route  - POST /auth/signup
// @access - Public
const signup = async (req, res)=> {
    try{
        const {username, name, email, password} = req.body;
        const user = await Users.findOne({username});
        if(!user){
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new Users({
                username,
                name,
                email,
                password: hashedPassword
            });
            await newUser.save();
            sendSignupMail(email, name);
            res.status(201).json({message: 'User created successfully'});
        }
        else{
            res.status(400).json({ message : "Username already exists" });
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - login registered user and issue jwt
// @route  - POST /auth/login
// @access - Public
const login = async (req, res)=> {
    try{
        const {username, password} = req.body;
        const user = await Users.findOne({username});
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                res.status(400).json({ message : 'Invalid password'});
            }
            else{
                const token = jwt.sign({id : user._id, username : user.username, name: user.name}, process.env.SECRET);
                res.status(200).json({ message : 'Login successful', token});
            }
        }
        else{
            res.status(404).json({ message : 'User not found'});
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - send verification code on registered email id
// @route  - POST /auth/forgot-password
// @access - Public
const forgotPassword = async (req, res)=> {
    try{
        const {username} = req.body;
        console.log(username);
        const user = await Users.findOne({username});
        if(user){
            const email = user.email;
            const vfcode = generateVerificationCode(6);
            user.vfcode = vfcode;
            await user.save();
            sendVFCodeMail(email, vfcode);
            res.status(200).json({ message : 'Verification code sent your registered email id'});
        }
        else{
            res.status(404).json({ message : 'User not found'});
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc   - verify the code and set new password
// @route  - POST /auth/reset-password
// @access - Public
const resetPassword = async (req, res)=> {
    try{
        const {vfcode, password, username} = req.body;
        const user = await Users.findOne({username});
        if(user){
            const savedVfCode = user.vfcode;
            if(savedVfCode == vfcode){
                const hashedPass = await bcrypt.hash(password, 10);
                await user.updateOne({password : hashedPass, vfcode : '0'});
                res.status(200).json({ message : 'Password reset successful'});
            }
            else{
                res.status(403).json({ message : 'Invalid verification code'});
            }
        }
        else{
            res.status(404).json({ message : 'User not found'});
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
};