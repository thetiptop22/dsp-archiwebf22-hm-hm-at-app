const express = require('express');
const router = express.Router();
const GiftController = require('../controllers/giftController');

// Create a new Gift
router.post('/gift', GiftController.create);

router.post('/initGifts', GiftController.initGifts)

// Get a Gift by ticket number
router.get('/gift/:number', GiftController.read);




module.exports = router;
