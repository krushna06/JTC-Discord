const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const commandsPath = path.join(__dirname, '../../commands');

router.get('/info', (req, res) => {
  fs.readdir(commandsPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read commands directory' });
    }

    const commandFiles = files.filter(file => file.endsWith('.js'));
    res.json({ numberOfCommands: commandFiles.length });
  });
});

router.get('/info/commands', (req, res) => {
  fs.readdir(commandsPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read commands directory' });
    }

    const commandFiles = files.filter(file => file.endsWith('.js'));
    res.json({ commands: commandFiles });
  });
});

module.exports = router;
