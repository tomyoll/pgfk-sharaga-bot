const { MODELS } = require('../constants');
const { Provider } = require('./super');

class AdminProvider extends Provider {
  constructor() {
    super(MODELS.ADMIN);
  }
}

module.exports = new AdminProvider();
