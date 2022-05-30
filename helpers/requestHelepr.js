const CONSTANTS = require('../constants');

class RequestHelper {
  params(query) {
    let { page, limit, search = null } = query;

    page = page ? Number(page) : 1;

    limit = limit ? Number(limit) : 25;

    const skip = page * limit;

    if (search) {
      search = this.search(search);
    }

    return { limit, page, skip, search };
  }

  search(query) {
    if (!query) {
      return null;
    }

    const replacedTxt = query.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, '\\$&').replace(/ +$/, '');

    return new RegExp(`.*${replacedTxt}.*`, 'ig');
  }
}

module.exports = new RequestHelper();
