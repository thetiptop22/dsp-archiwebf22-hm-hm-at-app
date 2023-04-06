const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');

// Create a new Client
router.post('/', ClientController.create);

// get client by login
router.post('/login', ClientController.login);

// Get all Clients
router.get('/clients', ClientController.list);

// Get a Client by email
router.get('/client/:email', ClientController.findbyemail);
// create new clien
router.post('/client',  ClientController.create)
// Update a client by id
router.put('/:id', ClientController.update);

router.post('/client/session', (req, res) => {
    console.log('client :: 1', req.body.client);
    req.session.client = req.body.client;
    res.locals.client = req.body.client;
    res.status(200).json({ success: true });
});

module.exports = router;
