const { MODELS } = require('../constants');
const { Provider } = require('./super');

class NavigationProvider extends Provider {
  constructor() {
    super(MODELS.USER_STATE);
  }
}

module.exports = new NavigationProvider();
