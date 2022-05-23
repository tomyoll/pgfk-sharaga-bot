const { MODELS } = require('../constants');
const { Provider } = require('./super');

class UserProvider extends Provider {
  constructor() {
    super(MODELS.USER);
  }
}

module.exports = new UserProvider();
