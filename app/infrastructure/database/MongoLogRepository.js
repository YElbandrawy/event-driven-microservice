const mongoose = require('mongoose');
const LogRepository = require('../../domain/repositories/logRepository');

const logSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

logSchema.index({ userId: 1 });
logSchema.index({ action: 1 });
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 });

const Log = mongoose.model('Log', logSchema);

/******************************************************/
class MongoLogRepository extends LogRepository {
  async save(log) {
    return await Log.create(log);
  }

  async find(filter) {
    const logs = await Log.find(filter);
    return logs;
  }
  getlogModel() {
    return Log;
  }
}

module.exports = new MongoLogRepository();
