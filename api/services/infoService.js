const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, '../../commands');
const dataPath = path.join(__dirname, '../../data.json');

const getCommandFiles = () => {
    try {
        const files = fs.readdirSync(commandsPath);
        return files.filter(file => file.endsWith('.js'));
    } catch (err) {
        console.error('Error reading commands directory:', err);
        throw err;
    }
};

const getData = () => {
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return data;
    } catch (err) {
        console.error('Error reading data.json:', err);
        throw err;
    }
};

module.exports = {
    getCommandFiles,
    getData,
};
