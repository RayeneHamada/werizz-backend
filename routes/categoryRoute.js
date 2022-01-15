const express = require('express');
const router = express.Router();
const jwtHelper = require('../config/jwtHelper');
const main_controller = require('../controllers/categoryController');

router.post('/addCategory', main_controller.newCategory);
router.post('/addParentCategory', main_controller.newParentCategory);
router.get('/all', main_controller.fetchAllCategories);
router.post('/rename', main_controller.renameCategory);

module.exports = router;