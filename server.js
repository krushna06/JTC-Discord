const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const commandsPath = path.join(__dirname, 'commands');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

    const commands = files.filter(file => file.endsWith('.js')).map(file => {
      const command = require(path.join(commandsPath, file));

      return {
        name: capitalizeFirstLetter(command.data.name),
        description: command.data.description,
      };
    });

    res.json({ commands });
  });
});

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});

module.exports = app;
