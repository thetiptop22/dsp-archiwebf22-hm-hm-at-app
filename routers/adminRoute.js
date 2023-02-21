const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// Create a new Admin
router.post('/', AdminController.create);

//Get admin by login
router.post('/login', AdminController.login);

module.exports = router;