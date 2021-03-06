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

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');
const socketio = require("socket.io");







const passport = require('passport');

const app = express();
app.use(cors());
app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false }))

 
app.use(bodyParser.json());

//import utils
const WebSockets = require("./utils/WebSockets.js");



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

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
    return res.status(404).json({
      success: false,
      message: 'API endpoint doesnt exist'
    })
});
  
/** Create HTTP server. */
const server = http.createServer(app);
/** Create socket connection */
global.WebSockets = WebSockets;
global.io = socketio(server);
global.io.on('connection', WebSockets.connection);

/** Listen on provided port, on all network interfaces. */
server.listen(process.env.PORT);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log('it works')
});