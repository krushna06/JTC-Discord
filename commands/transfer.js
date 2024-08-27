const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data.json');
let channelData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    data: {
        name: 'transfer',
    },
    async execute(interaction) {
        const newOwnerId = interaction.options.getUser('user').id;
        const channel = interaction.channel;
        const channelInfo = channelData.channels[channel.id];

        if (!channelInfo || channelInfo.ownerId !== interaction.user.id) {
            return interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
        }

        channelData.channels[channel.id].ownerId = newOwnerId;
        saveData();

        await interaction.reply({ content: 'Ownership transferred.', ephemeral: true });
    }
};
