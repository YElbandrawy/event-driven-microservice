const logsController = require('../controllers/logController');
const express = require('express');
const router = express.Router();

router.get('/', logsController.getLogs);

module.exports = router;
