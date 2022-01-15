const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/userController');
const imageUpload = require('../config/multerConfig').imageUpload;

router.post('/signup', main_controller.signup);
router.post('/BusinessSignup', main_controller.BusinessSignup_Step1);

router.post('/login', main_controller.authenticate);

router.post('/sendSMS',jwtHelper.verifyJwtToken, main_controller.sendCode);
router.post('/verif',jwtHelper.verifyJwtToken, main_controller.verifCode);
router.post('/updateFullName',jwtHelper.verifyJwtToken, main_controller.updateFullName);
router.post('/updatePassword',jwtHelper.verifyJwtToken, main_controller.updatePassword);
router.post('/updatePhoneNumber',jwtHelper.verifyJwtToken, main_controller.updatePhoneNumber);
router.post('/updateBio',jwtHelper.verifyJwtToken, main_controller.updateBio);
router.post('/updateProfileImage',[imageUpload.single('image'),jwtHelper.verifyJwtToken], main_controller.updateProfileImage);
router.post('/newAddress',jwtHelper.verifyJwtToken, main_controller.addAddress);


router.post('/taxRegistrationNumber', [imageUpload.single('image'),jwtHelper.verifyBusinessJwtToken], main_controller.taxRegistration);
router.post('/updateWebsite', jwtHelper.verifyBusinessJwtToken, main_controller.updateWebsite);
router.post('/updateCompanyName',jwtHelper.verifyBusinessJwtToken, main_controller.updateCompanyName);

router.post('/updateInterests',jwtHelper.verifyJwtToken, main_controller.updateIterests);
router.post('/follow',jwtHelper.verifyJwtToken, main_controller.follow);
router.post('/unfollow',jwtHelper.verifyJwtToken, main_controller.unfollow);
router.get('/peopleNearYou', main_controller.peopleNearYou);
router.get('/myPersonalProfile', jwtHelper.verifyJwtToken, main_controller.myPersonalProfile);
router.get('/businessHome', jwtHelper.verifyBusinessJwtToken, main_controller.businessHome);
module.exports = router;