require('dotenv').config();
// require models
require('./models/userModel');
require('./models/categoryModel');
require('./models/offerModel');
require('./models/storyModel');
require('./models/feedbackModel');
require('./models/notificationModel');


require('./config/dbConfig');
require('./config/passportConfig');


const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');








const passport = require('passport');

const app = express();
app.use(cors());
app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false }))

 
app.use(bodyParser.json());




//import routes
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const offerRoute = require('./routes/offerRoute');
const storyRoute = require('./routes/storyRoute');
const notificationRoute = require('./routes/notificationRoute');

//use routes
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/offer', offerRoute);
app.use('/story', storyRoute);
app.use('/notification', notificationRoute);



app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;