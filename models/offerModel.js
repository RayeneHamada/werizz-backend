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
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    expire_date: {
        type: Date,
    },
    duration: {
        type: String,
    },
    cover: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories"
    },
    state: {
        type: String,
        default: "draft"
    },
    feedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedbacks"
    }],
    stats: {
        reach: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});

/*offerSchema.pre('updateOne', function (next) {


    var oldVersion = this.getUpdate();
    console.log(oldVersion);
        changelog = new Changelog();
        changelog.title = oldVersion.title;
        changelog.price = oldVersion.price;
        changelog.discount = oldVersion.discount;
        changelog.description = oldVersion.description;
        changelog.duration = oldVersion.duration;
        changelog.cover = oldVersion.cover;
        changelog.duration = oldVersion.duration;

        changelog.save((err,doc) => {
            if (err) {
                next(err);
            }
            else{
                next();
            }
        })
    
});*/


// Export Offer model
var Offer = module.exports = mongoose.model('Offers', offerSchema);