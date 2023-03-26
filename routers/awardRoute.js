const express = require('express');
const router = express.Router();
const AwardController = require('../controllers/awardController');

// Create a new Award
router.post('/award', AwardController.create);

// Get a Award by client
// router.get('/:client', AwardController.read);

// Update a Award by id
router.put('/:id', AwardController.update);

// Get a award by admin
// router.put('/:admin', AwardController.list);

module.exports = router;
