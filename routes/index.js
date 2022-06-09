const express = require('express');

const router = express.Router();

const Controller = require('../controllers/user.controller');

const BotController = require('../controllers/bot.controller');

const AdminController = require('../controllers/admin.controller');

const AuthMiddleware = require('../middlewares/authentification');

router.get('/users', AuthMiddleware.authenticateToken, Controller.getAllUsers);

router.post('/message', Controller.sendMessage);

router.get('/launch', BotController.launch);

router.post('/stop', BotController.stop);

router.get('/news', AuthMiddleware.authenticateToken, BotController.getNews);

router.get('/news/:id', AuthMiddleware.authenticateToken, BotController.getItemById);

router.post(
  '/admin/signUp',
  AuthMiddleware.authenticateToken,
  AuthMiddleware.checkRole,
  AdminController.signUp
);

router.post('/admin/signIn', AdminController.signIn);

router.get('/admin/profile', AuthMiddleware.authenticateToken, AdminController.getProfile);

router.get('/refresh', AuthMiddleware.refreshToken);

module.exports = router;
