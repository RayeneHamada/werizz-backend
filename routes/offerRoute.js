const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/offerController');
const imageUpload = require('../config/multerConfig').imageUpload;



router.post('/create', [jwtHelper.verifyBusinessJwtToken, imageUpload.single('image')], main_controller.createOffer);
router.post('/publish', jwtHelper.verifyBusinessJwtToken, main_controller.publishOffer);
router.post('/updateImage', [jwtHelper.verifyBusinessJwtToken,imageUpload.single('image')], main_controller.updateImage);
router.get('/getOffer/:id', [jwtHelper.verifyJwtToken], main_controller.getOffer);
router.post('/updateOffer', [jwtHelper.verifyBusinessJwtToken], main_controller.updateOffer);
router.delete('/delete/:id', [jwtHelper.verifyBusinessJwtToken], main_controller.deleteOffer);


router.post('/addFeedback', jwtHelper.verifyJwtToken, main_controller.addFeedBack);

module.exports = router;