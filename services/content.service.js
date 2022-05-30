const userProvider = require('../providers/user.provider');
const allNewsProvider = require('../providers/allNewsProvider');

class ContentService {
  async getNews({ skip, limit, search }) {
    const { data, total } = await allNewsProvider.getNews({ skip, limit, search });

    data.forEach((item) => {
      item._id = item._id.toString();
    });

    return { data, total };
  }
}

module.exports = new ContentService();
