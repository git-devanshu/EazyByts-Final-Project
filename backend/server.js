const express = require('express');
const cors = require('cors');

const {connectToDB} = require('./configs/dbConfig');
const {authRouter} = require('./routes/authRoutes');
const {bookingRouter} = require('./routes/bookingRoutes');
const {commentRouter} = require('./routes/commentRoutes');
const {eventRouter} = require('./routes/eventRoutes');
const {userRouter} = require('./routes/userRoutes');

require('dotenv').config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// connection with db
connectToDB();

// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/event', eventRouter);
app.use('/booking', bookingRouter);
app.use('/comment', commentRouter);

// run the server
app.listen(process.env.PORT, () =>{
    console.log('Server is running on PORT :', process.env.PORT);
})