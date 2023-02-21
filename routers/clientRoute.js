const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');

// Create a new Client
router.post('/', ClientController.create);

// get client by login
router.post('/login', ClientController.login);

// Get all Clients
router.get('/', ClientController.list);

// Get a Client by email
router.get('/:email', ClientController.read);

// Update a client by id
router.put('/:id', ClientController.update);

module.exports = router;