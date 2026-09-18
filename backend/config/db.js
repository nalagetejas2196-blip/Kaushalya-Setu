const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '..', 'data', 'seed.json');
const STORE_FILE = path.join(__dirname, '..', 'data', 'store.json');

// Initialize store if missing
function initStore() {
  if (!fs.existsSync(STORE_FILE)) {
    const seedData = fs.readFileSync(SEED_FILE, 'utf-8');
    fs.writeFileSync(STORE_FILE, seedData, 'utf-8');
  }
}

initStore();

function readData() {
  try {
    initStore();
    const data = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading store.json, falling back to seed.json:', err);
    const seed = fs.readFileSync(SEED_FILE, 'utf-8');
    return JSON.parse(seed);
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing store.json:', err);
    return false;
  }
}

const db = {
  getCollection(name) {
    const data = readData();
    return data[name] || [];
  },

  find(collectionName, predicate = () => true) {
    const items = this.getCollection(collectionName);
    return items.filter(predicate);
  },

  findOne(collectionName, predicate) {
    const items = this.getCollection(collectionName);
    return items.find(predicate) || null;
  },

  findById(collectionName, id) {
    return this.findOne(collectionName, item => item.id === id);
  },

  insertOne(collectionName, item) {
    const data = readData();
    if (!data[collectionName]) data[collectionName] = [];
    data[collectionName].push(item);
    writeData(data);
    return item;
  },

  updateOne(collectionName, predicate, updates) {
    const data = readData();
    if (!data[collectionName]) return null;
    const index = data[collectionName].findIndex(predicate);
    if (index === -1) return null;

    data[collectionName][index] = {
      ...data[collectionName][index],
      ...updates
    };
    writeData(data);
    return data[collectionName][index];
  },

  deleteOne(collectionName, predicate) {
    const data = readData();
    if (!data[collectionName]) return false;
    const initialLen = data[collectionName].length;
    data[collectionName] = data[collectionName].filter(item => !predicate(item));
    writeData(data);
    return data[collectionName].length < initialLen;
  },

  resetDemoData() {
    const seedData = fs.readFileSync(SEED_FILE, 'utf-8');
    fs.writeFileSync(STORE_FILE, seedData, 'utf-8');
    return JSON.parse(seedData);
  }
};

module.exports = db;
