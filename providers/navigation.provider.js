const { MODELS } = require('../constants');
const { Provider } = require('./super');

class NavigationProvider extends Provider {
  constructor() {
    super(MODELS.NAVIGATION);
  }

  async getNavigationTitles() {
    return this.getMany({}, { title: 1 });
  }
}

module.exports = new NavigationProvider();
