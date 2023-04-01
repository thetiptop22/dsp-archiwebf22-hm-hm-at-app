const express = require('express');
const router = express.Router();
const AwardController = require('../controllers/awardController');

// Create a new Award
router.post('/award', AwardController.create);

// Get a Award by client
// router.get('/:client', AwardController.read);

router.get("/awards/:client", AwardController.list);

router.get("/awards/e/:client", AwardController.listByEmail);

// Update a Award by id
router.put('/award/:_id', AwardController.update);

// Get a award by admin
// router.put('/:admin', AwardController.list);

module.exports = router;
