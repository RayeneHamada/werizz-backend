// projectModel.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var changelogSchema = new Schema({
    updatedAt: {
        type: Date,
        default: Date.now
    },
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
        type: String,
        required: true
    },
    duration: {
        //minutes
        type: Number,
        required: true
    },
    cover: {
        type: String
    }


});
// Export Changelog model
var Changelog = module.exports = mongoose.model('Changelogs', changelogSchema);