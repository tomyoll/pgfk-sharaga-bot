const { MODELS } = require('../constants');
const { Provider } = require('./super');

class AllNewsProvider extends Provider {
  constructor() {
    super(MODELS.ALL_NEWS);
  }
}

module.exports = new AllNewsProvider();
