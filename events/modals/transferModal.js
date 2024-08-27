const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../data.json');
let channelData = require(dataPath);
const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    id: 'transferModal',
    async execute(interaction) {
        const newOwnerId = interaction.fields.getTextInputValue('newOwnerId');
        const newOwner = await interaction.guild.members.fetch(newOwnerId).catch(() => null);
        if (!newOwner) {
            await interaction.reply({ content: 'Invalid user ID.', ephemeral: true });
            return;
        }
        const channel = interaction.member.voice.channel;
        const channelId = channel.id;

        if (channelData.channels[channelId] && channelData.channels[channelId].ownerId === interaction.user.id) {
            channelData.channels[channelId].ownerId = newOwnerId;
            saveData();
            await interaction.reply({ content: `Channel ownership transferred to <@${newOwnerId}>.`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
        }
    }
};
