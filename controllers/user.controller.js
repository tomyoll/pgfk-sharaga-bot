const userProvider = require('../providers/user.provider');
const User = require('../models/users.model');
const bot = require('../app');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const response = await userProvider.getMany({}, { _id: 1, userName: 1, telegramId: 1 });

      res.status(200).json(response);
    } catch (e) {
      console.log(e);
    }
  }

  static async sendMessage(req, res) {
    const { paylaod } = req.body;

    const usersCount = await User.countDocuments();

    for (let i = 0; i <= usersCount; i++) {
      const users = await User.find()
        .skip(i * 10)
        .limit(10);

      bot.sendMessage(paylaod, users);
    }
  }
}

module.exports = UserController;
