const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/notificationController');

router.get('/all',jwtHelper.verifyBusinessJwtToken, main_controller.fetchAllBusinessNotif);
router.post('/send',jwtHelper.verifyJwtToken, main_controller.sendNotification);


module.exports = router;