const { MODELS } = require('../constants');
const { Provider } = require('./super');

class LinkProvider extends Provider {
  constructor() {
    super(MODELS.LINK);
  }
}

module.exports = new LinkProvider();
