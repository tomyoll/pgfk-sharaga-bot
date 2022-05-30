const { MODELS } = require('../constants');
const { Provider } = require('./super');

class AllNewsProvider extends Provider {
  constructor() {
    super(MODELS.ALL_NEWS);
  }

  async getNews({ skip = 1, limit = 25, search }) {
    const match = {};

    if (search) {
      match.$or = [
        {
          title: {
            $regex: search,
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.getMany(match, {}, { skip, limit }),
      this._.countDocuments(match.$or),
    ]);

    return { data, total };
  }
}

module.exports = new AllNewsProvider();
