const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const models = require('../models');

class Provider {
  constructor(model) {
    this._ = models[model];
  }

  getIdsArray(documents) {
    return documents.map((doc) => doc._id);
  }

  ObjectId(id = null) {
    return new ObjectId(id);
  }

  async createMany(documents, options = {}) {
    return this._.create(documents, options);
  }

  async createSingle(doc) {
    return this._.create(doc);
  }

  async deleteMany(filter, options = {}) {
    return this._.deleteMany(filter, options);
  }

  async getMany(match = {}, projection = {}, options = {}) {
    return this._.find(match, projection, options).lean();
  }

  async getSingleById(id, projection = {}, options = {}) {
    return this._.findById({ _id: ObjectId(id) }, projection, options).lean();
  }

  async updateSingle(filter, update = {}, options = {}) {
    return this._.updateOne(filter, update).lean();
  }

  async getSingle(filter, projection = {}, options = {}) {
    return this._.findOne(filter, projection, options).lean();
  }
}

module.exports = { Provider };
