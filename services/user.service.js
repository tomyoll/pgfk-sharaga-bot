const User = require('../models/users.model');
const bot = require('../app');

class UserService {
  async sendMessage(payload, selectedUsers) {
    const usersCount = await User.countDocuments();

    if (Array.isArray(selectedUsers) && selectedUsers.length) {
      await bot.sendMessage(payload, selectedUsers);
    } else {
      for (let i = 0; i <= usersCount; i++) {
        const users = await User.find()
          .skip(i * 10)
          .limit(10);

        await bot.sendMessage(payload, users);
      }
    }
  }
}

module.exports = new UserService();
