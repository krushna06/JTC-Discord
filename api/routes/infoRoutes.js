const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');

router.get('/info', infoController.getInfo);
router.get('/info/commands', infoController.getCommands);

module.exports = router;
