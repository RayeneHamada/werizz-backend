// projectModel.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var storySchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    expire_date: {
        type: Date,
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Categories"
    },

    stats: {
        views: {
            type: Number,
            default:0
        }
    }
    
});

  

// Export Offer model
var Story = module.exports = mongoose.model('Stories', storySchema);