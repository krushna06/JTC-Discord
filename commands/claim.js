const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data.json');
let channelData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    data: {
        name: 'claim',
    },
    async execute(interaction) {
        const channel = interaction.channel;
        const channelInfo = channelData.channels[channel.id];

        if (!channelInfo) {
            return interaction.reply({ content: 'This channel is not recognized.', ephemeral: true });
        }

        if (channelInfo.ownerId) {
            return interaction.reply({ content: 'This channel is already owned.', ephemeral: true });
        }

        channelData.channels[channel.id].ownerId = interaction.user.id;
        saveData();

        await interaction.reply({ content: 'You are now the owner of this channel.', ephemeral: true });
    }
};
