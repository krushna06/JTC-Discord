const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data.json');

const readData = () => {
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
        console.error('Error reading data file:', err);
        throw err;
    }
};

const getActiveChannels = (guildid) => {
    const data = readData();

    if (!data.guilds[guildid]) {
        return null;
    }

    const guild = data.guilds[guildid];
    const activeChannels = Object.keys(data.activeChannels).reduce((result, channelId) => {
        const activeChannel = data.activeChannels[channelId];
        const channelInfo = guild.channels[channelId];

        if (channelInfo) {
            result[channelId] = {
                createdAt: activeChannel.createdAt,
                ownerId: channelInfo.ownerId,
            };
        }
        return result;
    }, {});

    return activeChannels;
};

module.exports = {
    getActiveChannels,
};
