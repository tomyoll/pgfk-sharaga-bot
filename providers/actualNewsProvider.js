const { MODELS } = require('../constants');
const { Provider } = require('./super');

class ActualNewsProvdier extends Provider {
  constructor() {
    super(MODELS.ACTUAL_NEWS);
  }
}

module.exports = new ActualNewsProvdier();
