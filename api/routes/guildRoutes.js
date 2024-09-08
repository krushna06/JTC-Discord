const express = require('express');
const router = express.Router();
const guildController = require('../controllers/guildController');

router.get('/:guildid/active', guildController.getActiveChannels);

module.exports = router;
