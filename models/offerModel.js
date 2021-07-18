// projectModel.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var offerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    description: {
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    duration:{
        type: String,
        enum: ['global', 'personal'],
        required: true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    
});
// Export Offer model
var Offer = module.exports = mongoose.model('Offers', offerSchema);