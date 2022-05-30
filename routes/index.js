const express = require('express');

const router = express.Router();

const Controller = require('../controllers/user.controller');

const BotController = require('../controllers/bot.controller');

router.get('/users', Controller.getAllUsers);

router.post('/message', Controller.sendMessage);

router.get('/launch', BotController.launch);

router.post('/stop', BotController.stop);

router.get('/news', BotController.getNews);

module.exports = router;
