const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, '../../commands');

const getCommandFiles = () => {
    try {
        const files = fs.readdirSync(commandsPath);
        return files.filter(file => file.endsWith('.js'));
    } catch (err) {
        console.error('Error reading commands directory:', err);
        throw err;
    }
};

module.exports = {
    getCommandFiles,
};
