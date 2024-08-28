const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const commandsPath = path.join(__dirname, 'commands');

app.get('/api/v1/info', (req, res) => {
  fs.readdir(commandsPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read commands directory' });
    }

    const commandFiles = files.filter(file => file.endsWith('.js'));
    res.json({ numberOfCommands: commandFiles.length });
  });
});

app.get('/api/v1/info/commands', (req, res) => {
  fs.readdir(commandsPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read commands directory' });
    }

    const commandFiles = files.filter(file => file.endsWith('.js'));
    res.json({ commands: commandFiles });
  });
});

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});

module.exports = app;
