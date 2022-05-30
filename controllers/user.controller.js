const userProvider = require('../providers/user.provider');
const User = require('../models/users.model');
const bot = require('../app');

const UserService = require('../services/user.service');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const response = await userProvider.getMany(
        {},
        { _id: 1, userName: 1, telegramId: 1, chatId: 1 }
      );

      res.status(200).json(response);
    } catch (e) {
      console.log(e);
    }
  }

  static async sendMessage(req, res) {
    const { payload, users } = req.body;
    await UserService.sendMessage(payload, users);
  }
}

module.exports = UserController;
