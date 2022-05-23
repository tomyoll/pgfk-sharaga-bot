const express = require('express');

const router = express.Router();

const Controller = require('../controllers/user.controller');

router.get('/users', Controller.getAllUsers);

router.post('/message', Controller.sendMessage);

module.exports = router;
