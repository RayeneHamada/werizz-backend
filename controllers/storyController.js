const mongoose = require('mongoose'),
  Story = mongoose.model('Stories');
User = mongoose.model('Users');
var moment = require('moment');
const fs = require('fs');
var path = require('path');

exports.createStory = function (req, res, next) {
  story = new Story();
  story.content = req.file.filename;
  story.expire_date = moment(new Date()).add(24, 'h').toDate();
  story.category = req.body.category;
  story.owner = req._id;

  story.save((err, doc) => {
    if (err) {
      return res.status(500).send(err);
    }
    else {
      User.updateOne({ _id: req._id }, { $push: { stories: doc._id } }).then(
        (result, error1) => {
          res.status(201).json(doc);
        }
      ).catch(
        (error2) => {
          res.status(400).json({
            error: error2
          });
        }
      );

    }
  })
}


exports.deleteStory = function (req, res, next) {
  Story.findOne({ _id: req.params.id },
    (err, story) => {
      if (!story)
        return res.status(404).json({ status: false, message: 'Story record not found.' });
      else {

        if (story.owner == req._id) {

          Story.deleteOne({ _id: story._id }, story).then(
            () => {
              fs.unlink(path.join(process.cwd(), 'ressources', 'img', story.content), (err) => {
                if (err) {
                  res.status(500).json({
                    error: err
                  });
                }
                else {
                  res.status(200).json({
                    message: 'Offer deleted successfully!'
                  });
                }

              }
              )
            }).catch(
              (error) => {
                res.status(400).json({
                  error: error
                });
              }
            );
        }

        else {
          res.status(403).json({
            message: "not allowed"
          });
        }
      }


    });
}
