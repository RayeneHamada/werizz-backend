// categoryModel.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categorySchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    parent_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories"
    },


});
// Export Category model
var Category = module.exports = mongoose.model('Categories', categorySchema);