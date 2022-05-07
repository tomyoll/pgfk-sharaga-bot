const { MODELS } = require('../constants');
const { Provider } = require('./super');

class FirstPageProvider extends Provider {
  constructor() {
    super(MODELS.FIRST_PAGE);
  }
}

module.exports = new FirstPageProvider();
