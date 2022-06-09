const userService = require('../services/user.service');
const ContentService = require('../services/content.service');
const bot = require('../app');
const requestHelper = require('../helpers/requestHelepr');
const allNewsProvider = require('../providers/allNewsProvider');

class BotController {
  static async stop(req, res) {
    try {
      const { reason } = req.body;
      await userService.sendMessage(reason);
      bot.stop();
      res.status(200).end();
    } catch (e) {
      console.log(e);
    }
  }

  static launch(req, res) {
    try {
      bot.launch();
      res.status(200).end();
    } catch (e) {
      console.log(e);
    }
  }

  static async getNews(req, res) {
    try {
      const { skip, limit, search } = requestHelper.params(req.query);
      console.log({ skip, limit, search });
      const responseData = await ContentService.getNews({ skip, limit, search });

      res.status(200).json(responseData);
    } catch (e) {
      console.log(e);
    }
  }

  static async getItemById(req, res) {
    try {
      const { id } = req.params;

      const responseData = await allNewsProvider.getSingleById(id);
      res.status(200).json(responseData);
      return responseData;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = BotController;
