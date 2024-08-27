const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../data.json');
let channelData = require(dataPath);
const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    id: 'claimModal',
    async execute(interaction) {
        const channelId = interaction.fields.getTextInputValue('channelId');
        if (!channelData.channels[channelId] || !interaction.guild.channels.cache.has(channelId)) {
            await interaction.reply({ content: 'Invalid channel ID or not a voice channel.', ephemeral: true });
            return;
        }
        const channel = interaction.guild.channels.cache.get(channelId);
        if (channel && channel.type === 'GUILD_VOICE') {
            if (channelData.channels[channelId].ownerId) {
                await interaction.reply({ content: 'This channel already has an owner.', ephemeral: true });
            } else {
                channelData.channels[channelId].ownerId = interaction.user.id;
                saveData();
                await interaction.reply({ content: `You have claimed ownership of the voice channel ${channel.name}.`, ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'Invalid channel ID or not a voice channel.', ephemeral: true });
        }
    }
};
