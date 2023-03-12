const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/ticketController');

// Create a new Ticket
router.post('/', TicketController.create);

// Get a Ticket by number
router.get('/:number', TicketController.read);



module.exports = router;
