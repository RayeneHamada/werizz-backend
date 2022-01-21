
const mongoose = require('mongoose'),
Notification = mongoose.model('Notifications');

exports.sendNotification = async (notif) => {
  try {
    notification = new Notification();
    notification.sender = notif.sender;
    notification.receiver = notif.receiver;
    notification.type = notif.type;
    notification.content = notif.content;
    await notification.save();
    global.io.sockets.to(WebSockets.getSocketId(notification.receiver)).emit('notification', notification);
  }
  catch (err) {
    console.log('err' + err);
  }
}

exports.fetchAllBusinessNotif = function (req, res) {

  Notification.find({ receiver: req._id }, '_id created_at sender type content created_at seen').
    populate({ path: 'sender', select: 'fullName profile_image' }).
    exec((err, doc) => {

      if (err) {

        return res.status(500).json(err);
      }
      else {
        return res.status(200).send(doc);
      }
    });
}
