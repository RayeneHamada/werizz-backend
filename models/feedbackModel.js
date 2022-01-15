// projectModel.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var feedbackSchema = new Schema({
    feedback_type: {
        type: String,
        enum: ['h', 'm','l'],
    },
    feedback_content: {
        type: String,
    },
    seen: {
        type: Boolean,
        default:false,
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offers"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    created_at: {
        type: Date,
        default: Date.now
    }

    
});

  

// Export Offer model
var Feedback = module.exports = mongoose.model('Feedbacks', feedbackSchema);