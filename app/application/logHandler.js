const logProcessor = require('../domain/services/processLog');
const logRepository = require('../infrastructure/database/MongoLogRepository');
const Log = require('../domain/entities/Log');

module.exports = async (userLog) => {
  try {
    let newLog = new Log(userLog.userId, userLog.action);
    //process
    newLog = logProcessor(newLog);
    await logRepository.save(newLog);
    console.log('New log saved successfully');
  } catch (err) {
    console.log('Failed to save log:', err);
  }
};
