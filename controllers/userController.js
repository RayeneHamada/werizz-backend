const mongoose = require('mongoose'),
  User = mongoose.model('Users'),
  Notification = mongoose.model('Notifications'),
  Offer = mongoose.model('Offers');
const passport = require('passport');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { upperFirst, rearg } = require('lodash');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.SERVICE_SID;
const client = require('twilio')(accountSid, authToken);
const multer = require("multer");
const geocoder = require('../utils/geocoder');
var ObjectId = require('mongodb').ObjectID;


exports.signup = function (req, res, next) {
  var user = new User();
  user.fullName = req.body.fullName;
  user.email = req.body.email;
  user.password = req.body.password;


  user.save((err, doc) => {
    if (!err) {
      res.status(200).json({ token: user.generateJwt(), id: doc._id, fullName: doc.fullName, role: user.role, activated: user.activated });

    }
    else {
      if (err.code == 11000)
        res.status(422).send(['Duplicate email adrress found.']);
      else
        return next(err);
    }

  });
}

exports.BusinessSignup_Step1 = function (req, res, next) {
  var user = new User();
  user.fullName = req.body.fullName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.role = "business";
  if (req.body.business_type == 'trader') {
    user.business.trader.company_name = req.body.company_name;
    user.business.trader.registration_number = req.body.registration_number;
    user.business.trader.website = req.body.website;

  }
  else if (req.body.business_type == 'private seller') {
    user.business.private_seller.business_name = req.body.business_name;

  }
  else {
    return res.status(400).json({ message: "invalid business type" });

  }
  user.save((err, doc) => {
    if (!err) {
      if (req.body.business_type == 'private seller')
        res.status(200).json({ token: user.generateJwt(), id: doc._id, fullName: doc.fullName, role: req.body.business_type, verified: doc.activated });
      else if (req.body.business_type == 'trader') {
        res.status(200).json({ token: user.generateJwt(), id: doc._id, fullName: doc.fullName, role: req.body.business_type, verified: doc.business.trader.tax_registration_number_verified });
      }
    }
    else {
      if (err.code == 11000)
        res.status(422).send({ message: "invalid request body", fields: err.keyPattern });
      else
        return next(err);
    }

  });
}

exports.sendCode = function (req, res, next) {
  User.exists({ phoneNumber: req.body.phoneNumber }, function (err, exist) {
    if (err) {
      res.send(err);
    }
    else {
      if (exist) {
        return res.status(406).json({ message: "phone number already used" });
      }
      else {
        client.verify.services(serviceSid)
          .verifications
          .create({ to: req.body.phoneNumber, channel: 'sms' })
          .then(verification => {

            if (verification.status == "pending") {
              User.findOne({ _id: req._id },
                (err, user) => {
                  if (!user)
                    return res.status(404).json({ message: 'User record not found.' });
                  else {
                    user.phoneNumber = req.body.phoneNumber;
                    User.updateOne({ _id: req._id }, user).then(
                      () => {
                        res.status(200).json({ message: "SMS sent successfuly" });
                      }
                    ).catch(
                      (error) => {
                        res.status(400).json({
                          error: error
                        });
                      }
                    );
                  }
                });
            }
            else {
              res.status(400).json({ error: "erreur" });
            }
          });

      }
    }
  });



}

exports.verifCode = function (req, res, next) {

  // si le compte n'est pas activé
  client.verify.services(serviceSid)
    .verificationChecks
    .create({ to: req.body.phoneNumber, code: req.body.code })
    .then(verification_check => {
      if (verification_check.status == "approved") {

        User.findOne({ _id: req._id },
          (err, user) => {
            if (!user)
              return res.status(404).json({ message: 'User record not found.' });
            else {
              user.activated = true;
              User.updateOne({ _id: req._id }, user).then(
                () => {
                  res.json({ message: "Account verified successfuly" });
                }
              ).catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );
            }
          });
      }
      else
        res.status(400).json({ verified: false });
    })
    .catch(error => res.status(400).json({ error: error, verified: false }));

}

exports.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {
    // error from passport middleware
    if (err) return res.status(400).json(err);
    // registered user
    else if (user) return res.status(200).json({ "token": user.generateJwt(), id: user._id, fullName: user.fullName, role: user.role, activated: user.activated });
    // unknown user or wrong password
    else return res.status(404).json(info);
  })(req, res);
}

exports.myPersonalProfile = (req, res, next) => {
  User.aggregate(
    [
      {
        "$match": { "_id": ObjectId(req._id) },
      },
      {
        '$lookup':
        {
          'from': "categories",
          'localField': "interests",
          'foreignField': "_id",
          'as': "interests"
        }
      },
      {
        '$lookup':
        {
          'from': "stories",
          'localField': "stories",
          'foreignField': "_id",
          'as': "stories"
        }
      },
      
      
      {
        "$project": {
          "fullName": 1,
          "profile_image": 1,
          "bio": 1,
          "interests": 1,
          "stories": 1,
          "followers":{"$size":"$followers"},
          "following":{"$size":"$following"},
        },
        
      }
    ],
    (err, results) => {

      res.status(201).send(results);
    }
  )
}

exports.taxRegistration = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.business.tax_registration_number_image = req.file.filename;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'User updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}

exports.updateFullName = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.fullName = req.body.fullName;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'User updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}

exports.updateBio = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.bio = req.body.bio;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'User updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}

exports.updateProfileImage = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.profile_image = req.file.filename;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'User profile image successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}

exports.updatePhoneNumber = (req, res) => {

}

exports.updatePassword = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        bcrypt.hash(req.body.oldPassword, user.saltSecret, function (err, hash) {
          if (hash == user.password) {

            bcrypt.genSalt(10, function (err, salt) {
              if (err) return
              bcrypt.hash(req.body.newPassword, salt, function (err, hash1) {
                if (err) return
                user.password = hash1;
                user.saltSecret = salt;
                User.findOneAndUpdate({ _id: user._id }, user)
                  .then(() => res.status(200).json({ message: "Password changed Successfuly" }))
                  .catch(err => res.status(500).json(err))
              })
            })
          }
          else {
            res.status(400).send({ message: 'wrong password' })
          }
        });

      }

    });

}

exports.updateCompanyName = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.business.company_name = req.body.company_name;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'Company name updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}

exports.updateWebsite = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.business.website = req.body.website;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'Website updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}

exports.addAddress = async (req, res) => {
  const loc = await geocoder.geocode({
    address: req.body.street + " " + req.body.city,
    country: req.body.country,
    zipcode: req.body.landmark
  });
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {

        address = { "address_name": req.body.address_name, "street": req.body.street, "landmark": req.body.landmark, "city": req.body.city };
        address.geolocation = {
          coordinates: [loc[0].latitude, loc[0].longitude],
        };
        User.updateOne({ _id: user._id }, { $push: { "addresses": address } }).then(
          () => {
            res.status(201).json({
              message: 'Adress added successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}

exports.updateIterests = async (req, res) => {

  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.interests = req.body.interests;
        User.updateOne({ _id: user._id }, user, (err, doc) => {
          res.status(200).send({ Message: "Interests updated successfuly" });
        }).catch(
          (error) => {
            res.status(400).json({ error: error });
          }
        );

      }
    }).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
}

exports.follow = async (req, res) => {

  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        if (!user.following.includes(req.body.follow)) {
          User.updateOne({ _id: user._id }, { $push: { following: req.body.follow } }).then(
            () => {


              User.findOne({ _id: req.body.follow },
                (err, user2) => {
                  if (!user2)
                    return res.status(404).json({ status: false, message: 'User to follow does not exist' });
                  else {
                    User.updateOne({ _id: user2._id }, { $push: { followers: req._id } }).then(
                      () => {


                        res.status(201).json({
                          message: user.fullName + ' is folloing ' + user2.fullName + ' now !'
                        });
                      }
                    ).catch(
                      (error) => {
                        res.status(400).json({
                          error: error
                        });
                      }
                    );
                  }
                });
            }
          );
        }
        else {
          res.status(400).json({
            "message": "already followed"
          });
        }
      }
    });
}

exports.unfollow = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        if (user.following.includes(req.body.follow)) {
          User.updateOne({ _id: user._id }, { $pull: { following: req.body.follow } }).then(
            () => {


              User.findOne({ _id: req.body.follow },
                (err, user2) => {
                  if (!user2)
                    return res.status(404).json({ status: false, message: 'User to follow does not exist' });
                  else {
                    User.updateOne({ _id: user2._id }, { $pull: { followers: req._id } }).then(
                      () => {


                        res.status(201).json({
                          message: user.fullName + ' unfollowed ' + user2.fullName + ' now !'
                        });
                      }
                    ).catch(
                      (error) => {
                        res.status(400).json({
                          error: error
                        });
                      }
                    );
                  }
                });
            }
          );
        }
        else {
          res.status(400).json({
            "message": "already not followed"
          });
        }
      }
    });
}

exports.isFollowing = (user) => {
  User.findOne({ _id: req.body.offerId },
    (err, offer) => {
      if (!offer)
        return res.status(404).json({ status: false, message: 'Offer record not found.' });
      else {
        Offer.updateOne({ _id: offer._id }, { $push: { feedbacks: { "feedback_type": req.body.feedback_type, "feedback_content": req.body.feedback_content, "owner": req._id } } }).then(
          (result, error1) => {
            res.status(201).json({
              message: 'Feedback added successfully!'
            });
          }
        ).catch(
          (error2) => {
            res.status(400).json({
              error: error2
            });
          }
        );

      }


    });
}

exports.peopleNearYou = (req, res) => {
  User.aggregate(
    [
      {
        "$geoNear": {
          "near": {
            "type": "Point",
            "coordinates": [req.body.lng, req.body.lat]
          },
          "distanceField": "distance",
          "spherical": true,
          "maxDistance": 3000,
          "query": { "role": "user" },
        }
      }
    ],
    function (err, results) {

      res.status(201).send(results);
    }
  )
}

exports.shopsNearYou = (req, res) => {
  User.aggregate(
    [
      {
        "$geoNear": {
          "near": {
            "type": "Point",
            "coordinates": [req.body.lng, req.body.lat]
          },
          "distanceField": "distance",
          "spherical": true,
          "maxDistance": 3000,
          "query": { "role": "business" },
        }
      }
    ],
    function (err, results) {

      res.status(201).send(results);
    }
  )
}

exports.businessHome = async (req, res) => {
  let comments = 0;
  let messages = 0;
  comments = await Notification.countDocuments({ receiver: req._id, is_read: false }).exec();
  recent_offers = await Offer.find({ owner: req._id }).limit(2);
  res.status(200).send({ "comments": comments,"messages":messages,"recent_offers":recent_offers });
}