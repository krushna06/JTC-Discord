const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../../data.json');

const readData = () => {
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
        console.error('Error reading data file:', err);
        throw err;
    }
};

router.get('/:guildid/active', (req, res) => {
    const { guildid } = req.params;
    const data = readData();

    if (!data.guilds[guildid]) {
        return res.status(404).json({ error: 'Guild not found' });
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

    return res.json(activeChannels);
});

module.exports = router;
