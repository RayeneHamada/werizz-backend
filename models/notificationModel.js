const mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({

    sender : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    receiver : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    type: {
        type: String,
        enum : ['feedback','transaction','follow'],
    },
    content: {
        type:String
    },
    is_read: {
        type: Boolean,
        default:false
    },
    created_at: {
        type: Date,
        default: Date.now
    }

  });


mongoose.model('Notifications', notificationSchema);