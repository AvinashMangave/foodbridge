const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, '..', 'data', 'store.json');

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

class Store {
  constructor() {
    this.data = {
      users: [],
      foodDonations: [],
      donationRequests: [],
      notifications: [],
      ngoProfiles: [],
      contactMessages: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading local mock database:', err.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving local mock database:', err.message);
    }
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }
}

const storeInstance = new Store();

function matchCriteria(item, query = {}) {
  for (const key of Object.keys(query)) {
    if (key === '$or') {
      const matched = query.$or.some(subQuery => matchCriteria(item, subQuery));
      if (!matched) return false;
      continue;
    }
    if (key === '$and') {
      const matched = query.$and.every(subQuery => matchCriteria(item, subQuery));
      if (!matched) return false;
      continue;
    }
    if (query[key] && typeof query[key] === 'object' && !Array.isArray(query[key]) && !(query[key] instanceof Date)) {
      const val = item[key];
      const cond = query[key];
      if (cond.$in && Array.isArray(cond.$in)) {
        if (!cond.$in.includes(val)) return false;
      }
      if (cond.$nin && Array.isArray(cond.$nin)) {
        if (cond.$nin.includes(val)) return false;
      }
      if (cond.$ne !== undefined && val === cond.$ne) {
        return false;
      }
      if (cond.$gt !== undefined && !(val > cond.$gt)) return false;
      if (cond.$gte !== undefined && !(val >= cond.$gte)) return false;
      if (cond.$lt !== undefined && !(val < cond.$lt)) return false;
      if (cond.$lte !== undefined && !(val <= cond.$lte)) return false;
      if (cond.$regex) {
        const reg = new RegExp(cond.$regex, cond.$options || 'i');
        if (!reg.test(String(val || ''))) return false;
      }
      continue;
    }

    // Direct match or string regex
    if (query[key] instanceof RegExp) {
      if (!query[key].test(String(item[key] || ''))) return false;
    } else if (String(item[key]) !== String(query[key])) {
      return false;
    }
  }
  return true;
}

class MockModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  get collection() {
    return storeInstance.getCollection(this.collectionName);
  }

  async find(query = {}) {
    const items = this.collection.filter(item => matchCriteria(item, query));
    // return deep cloned copies with helper methods
    return items.map(item => ({ ...item, _id: item._id || item.id }));
  }

  async findOne(query = {}) {
    const item = this.collection.find(item => matchCriteria(item, query));
    return item ? { ...item, _id: item._id || item.id } : null;
  }

  async findById(id) {
    const item = this.collection.find(i => String(i._id || i.id) === String(id));
    return item ? { ...item, _id: item._id || item.id } : null;
  }

  async create(doc) {
    const newDoc = {
      _id: doc._id || generateId(),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.collection.unshift(newDoc);
    storeInstance.save();
    return { ...newDoc };
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const index = this.collection.findIndex(i => String(i._id || i.id) === String(id));
    if (index === -1) return null;

    const existing = this.collection[index];
    const updateData = update.$set ? update.$set : update;
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (update.$push) {
      for (const [key, val] of Object.entries(update.$push)) {
        if (!Array.isArray(updated[key])) updated[key] = [];
        updated[key].push(val);
      }
    }

    this.collection[index] = updated;
    storeInstance.save();
    return { ...updated };
  }

  async findByIdAndDelete(id) {
    const index = this.collection.findIndex(i => String(i._id || i.id) === String(id));
    if (index === -1) return null;
    const removed = this.collection.splice(index, 1)[0];
    storeInstance.save();
    return removed;
  }

  async countDocuments(query = {}) {
    return this.collection.filter(item => matchCriteria(item, query)).length;
  }

  async insertMany(docs) {
    const inserted = docs.map(d => ({
      _id: d._id || generateId(),
      ...d,
      createdAt: d.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    this.collection.push(...inserted);
    storeInstance.save();
    return inserted;
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      this.collection.length = 0;
      storeInstance.save();
      return { deletedCount: 0 };
    }
    const initialLen = this.collection.length;
    const remaining = this.collection.filter(item => !matchCriteria(item, query));
    this.collection.length = 0;
    this.collection.push(...remaining);
    storeInstance.save();
    return { deletedCount: initialLen - remaining.length };
  }
}

module.exports = {
  storeInstance,
  MockModel,
  generateId
};
