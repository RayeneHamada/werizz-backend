require('dotenv').config();
// require models
require('./models/userModel');


require('./config/dbConfig');
require('./config/passportConfig');

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');







const passport = require('passport');

const app = express();
app.use(cors());
app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false }))

 
app.use(bodyParser.json());

//import routes
const userRoute = require('./routes/userRoute');

//use routes
app.use('/user', userRoute);


app.get('/test', (req,res) => { return res.json({ahla:'ahla'}) });


module.exports = app;