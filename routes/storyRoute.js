const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/storyController');
const imageUpload = require('../config/multerConfig').imageUpload;

router.post('/new', [imageUpload.single('image'),jwtHelper.verifyJwtToken, ], main_controller.createStory);
router.delete('/delete/:id',jwtHelper.verifyJwtToken, main_controller.deleteStory);



module.exports = router;