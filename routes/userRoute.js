const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/userController');
const imageUpload = require('../config/multerConfig').imageUpload;

router.post('/signup', main_controller.signup);
router.post('/BusinessSignup', main_controller.BusinessSignup);
router.post('/sendSMS', main_controller.sendCode);
router.post('/verif', main_controller.verifCode);
router.post('/login', main_controller.authenticate);


router.post('/updateFullName',jwtHelper.verifyJwtToken, main_controller.updateFullName);
router.post('/updatePassword',jwtHelper.verifyJwtToken, main_controller.updatePassword);
router.post('/updatePhoneNumber',jwtHelper.verifyJwtToken, main_controller.updatePhoneNumber);
router.post('/updateProfileImage',[imageUpload.single('image'),jwtHelper.verifyJwtToken], main_controller.updateProfileImage);


router.post('/taxRegistrationNumber', [imageUpload.single('image'),jwtHelper.verifyBusinessJwtToken], main_controller.taxRegistration);
router.post('/updateWebsite', jwtHelper.verifyBusinessJwtToken, main_controller.updateWebsite);
router.post('/updateCompanyName',jwtHelper.verifyBusinessJwtToken, main_controller.updateCompanyName);
router.post('/updateBusinessAdsress',jwtHelper.verifyBusinessJwtToken, main_controller.updateBusinessAddress);



module.exports = router;