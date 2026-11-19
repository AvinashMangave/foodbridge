const mongoose = require('mongoose');
const { isMock } = require('../config/db');
const { MockModel } = require('../config/mockStore');

function createAdaptiveModel(modelName, schema, collectionName) {
  let mongooseModel = null;

  try {
    mongooseModel = mongoose.models[modelName] || mongoose.model(modelName, schema);
  } catch (e) {
    // Schema creation safe catch
  }

  const mockModel = new MockModel(collectionName);

  const shouldUseNative = () => {
    return !isMock() && mongooseModel && mongoose.connection.readyState === 1;
  };

  return {
    async find(query = {}) {
      if (shouldUseNative()) {
        return await mongooseModel.find(query).lean().exec();
      }
      return await mockModel.find(query);
    },

    async findOne(query = {}) {
      if (shouldUseNative()) {
        return await mongooseModel.findOne(query).lean().exec();
      }
      return await mockModel.findOne(query);
    },

    async findById(id) {
      if (shouldUseNative()) {
        return await mongooseModel.findById(id).lean().exec();
      }
      return await mockModel.findById(id);
    },

    async create(doc) {
      if (shouldUseNative()) {
        const created = await mongooseModel.create(doc);
        return created.toObject ? created.toObject() : created;
      }
      return await mockModel.create(doc);
    },

    async findByIdAndUpdate(id, update, options = { new: true }) {
      if (shouldUseNative()) {
        return await mongooseModel.findByIdAndUpdate(id, update, { new: true, ...options }).lean().exec();
      }
      return await mockModel.findByIdAndUpdate(id, update, options);
    },

    async findByIdAndDelete(id) {
      if (shouldUseNative()) {
        return await mongooseModel.findByIdAndDelete(id).lean().exec();
      }
      return await mockModel.findByIdAndDelete(id);
    },

    async countDocuments(query = {}) {
      if (shouldUseNative()) {
        return await mongooseModel.countDocuments(query);
      }
      return await mockModel.countDocuments(query);
    },

    async insertMany(docs) {
      if (shouldUseNative()) {
        return await mongooseModel.insertMany(docs);
      }
      return await mockModel.insertMany(docs);
    },

    async deleteMany(query = {}) {
      if (shouldUseNative()) {
        return await mongooseModel.deleteMany(query);
      }
      return await mockModel.deleteMany(query);
    },

    get rawMongooseModel() {
      return mongooseModel;
    }
  };
}

module.exports = { createAdaptiveModel };
