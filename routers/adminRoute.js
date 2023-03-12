const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// Create a new Admin
router.post('/', AdminController.create);

//Get admin by login
router.get('/admin/:email', AdminController.findbyemail);

router.post("/admins/init", AdminController.initAdmins);

module.exports = router;
