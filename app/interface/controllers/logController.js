const logRepository = require('../../infrastructure/database/MongoLogRepository');
const APIFeatures = require('../../infrastructure/utils/apiFeatures');

exports.getLogs = async (req, res) => {
  try {
    const LogModel = logRepository.getlogModel();
    if (!LogModel || !LogModel.find) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Invalid log model' });
    }

    // build the query
    const features = new APIFeatures(LogModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // execute the query
    const logs = await features.query;

    res.status(200).json({
      status: 'success',
      results: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve logs',
      error: error.message,
    });
  }
};
