// categoryModel.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
    
});
// Export Category model
var Category = module.exports = mongoose.model('Categories', categorySchema);