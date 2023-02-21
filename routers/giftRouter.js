const express = require('express');
const router = express.Router();
const GiftController = require('../controllers/giftController');

// Create a new Gift
router.post('/', GiftController.create);

// Get a Gift by id
router.get('/:id', GiftController.read);




module.exports = router;