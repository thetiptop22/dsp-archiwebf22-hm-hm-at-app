const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/user', UserController.create);
router.post('/client', UserController.createClient);
router.get('/users', UserController.get);





module.exports = router;
