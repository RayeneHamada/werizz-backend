const mongoose  = require('mongoose'),
Offer = mongoose.model('Offers');
Feedback = mongoose.model('Feedbacks');
var moment = require('moment');
const {sendNotification} = require('../controllers/notificationController');

exports.createOffer = function(req,res,next)
{
    offer = new Offer();
    offer.title = req.body.title;
    offer.price = req.body.price;
    offer.discount = req.body.discount;
    offer.description = req.body.description;
    offer.category = req.body.category;
    offer.duration = req.body.duration;
    offer.owner = req._id;
    offer.cover = req.file.filename;

    offer.save((err,doc) => {
        if(err){
            return res.status(500).send(err);
        }
        else{
            return res.status(201).send(doc);
        }
    })
}

exports.publishOffer = function(req,res,next)
{
    Offer.findOne({ _id: req.body.id },
        (err, offer) => {
            if (!offer)
                return res.status(404).json({ status: false, message: 'Offer record not found.' });
            else
                {

                  if(offer.owner == req._id)
                  {
                    offer.state = "online";
                    offer.start_date = new Date();
                    offer.expire_date = offer.start_date;
                    offer.duration = req.body.duration;
                    let duration = req.body.duration;
                    let expire_hours = Number(duration.split(":")[0]);
                    let expire_minutes = Number(duration.split(":")[1]);
                    let expire_seconds = Number(duration.split(":")[2]);
                    let expire_date = moment(offer.start_date).add(expire_hours, 'h');
                    expire_date = moment(expire_date).add(expire_minutes, 'm');
                    offer.expire_date = moment(expire_date).add(expire_seconds, 's').toDate();
                    Offer.updateOne({_id: offer._id}, offer).then(
                      () => {
                        res.status(200).json({
                          message: 'Offer published successfully!'
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
              
                  else {
                    res.status(403).json({
                      message: "Forbidden : You are not the owner of this offer"
                    });
                  }
                }
              
          
        });
}


exports.updateImage = (req, res) => {
    Offer.findOne({ _id: req.body.id },
      (err, offer) => {
          if (!offer)
              return res.status(404).json({ status: false, message: 'Offer record not found.' });
          else
              {
                offer.title = req.body.title;
                offer.price = req.body.price;
                offer.discount = req.body.discount;
                offer.description = req.body.description;
                offer.category = req.category;
                offer.duration = req.body.duration;
                Offer.updateOne({_id: offer._id}, offer).then(
                  () => {
                    res.status(200).json({
                      message: 'Offer updated successfully!'
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

exports.updateOffer = (req, res) => {
  Offer.findOne({ _id: req.body.id },
    (err, offer) => {
        if (!offer)
            return res.status(404).json({ status: false, message: 'Offer record not found.' });
        else
            {
              offer = req.body.filename;
              offer = req.body.filename;
              offer = req.body.filename;
              offer = req.body.filename;
              offer = req.body.filename;
              Offer.updateOne({_id: offer._id}, offer).then(
                () => {
                  res.status(201).json({
                    message: 'Offer updated successfully!'
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

exports.deleteOffer = function(req,res,next)
{
    Offer.findOne({ _id: req.params.id },
        (err, offer) => {
            if (!offer)
                return res.status(404).json({ status: false, message: 'Offer record not found.' });
            else
                {

                  if(offer.owner == req._id)
                  {
                    offer.state = "deleted";
                    offer.start_date = new Date();
                    Offer.updateOne({_id: offer._id}, offer).then(
                      () => {
                        res.status(200).json({
                          message: 'Offer deleted successfully!'
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
              
                  else {
                    res.status(403).json({
                      message: "Forbidden : you are not the owner of this offer"
                    });
                  }
                }
              
          
        });
}

exports.addFeedBack = async (req,res,) =>{
  feedback = new Feedback();
  feedback.feedback_type = req.body.feedback_type;
  feedback.feedback_content = req.body.feedback_content;
  feedback.owner = req._id;
  feedback.offer = req.body.offerId;
  feedback.save((err,doc) => {
    if(err){
        return res.status(500).send(err);
    }
    else {
      Offer.findOne({ _id: req.body.offerId },
        (err, offer) => {
            if (!offer)
                return res.status(404).json({ status: false, message: 'Offer record not found.' });
            else
                {
                    Offer.updateOne({_id: offer._id}, { $push: { feedbacks: doc._id } }).then(
                      (result, error1) => {
                        sendNotification({ "sender": req._id, "receiver": offer.owner, "type": "feedback", content: req.body.feedback_type });
                        return res.status(201).send(doc);
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
})

   
}

exports.getShopActiveOffers = (req, res) => {
  Offer.findOne({ _id: req.body.id },
    (err, offer) => {
        if (!offer)
            return res.status(404).json({ status: false, message: 'Offer record not found.' });
        else
            {
              offer = req.body.filename;
              offer = req.body.filename;
              offer = req.body.filename;
              offer = req.body.filename;
              offer = req.body.filename;
              Offer.updateOne({_id: offer._id}, offer).then(
                () => {
                  res.status(200).json({
                    message: 'Offer updated successfully!'
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

exports.getOffer = (req, res) => {
  Offer.findOne({ _id: req.params.id, state: "online" }).
    populate('owner', ['fullName','profile_image']).
    populate('feedbacks.owner', ['fullName','profile_image'])
    .exec(
    (err, offer) => {
        if (!offer)
            return res.status(404).json({ status: false, message: 'Offer record not found.' });
        else
            {
              offer.stats.views++;
              Offer.updateOne({_id: offer._id}, offer).then(
                () => {
                  res.status(200).json(offer);
                }
              )
            }
    });
  
}