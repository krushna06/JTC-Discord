const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../data.json');
let channelData = require(dataPath);
const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    id: 'claim',
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const channelId = channel.id;

        if (channelData.channels[channelId] && channelData.channels[channelId].ownerId) {
            await interaction.reply({ content: 'This channel is already claimed.', ephemeral: true });
        } else {
            channelData.channels[channelId] = { ownerId: interaction.user.id };
            saveData();
            await interaction.reply({ content: `You have claimed ownership of the voice channel ${channel.name}.`, ephemeral: true });
        }
    }
};
