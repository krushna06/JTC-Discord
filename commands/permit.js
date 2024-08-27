const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data.json');
let channelData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    data: {
        name: 'permit',
    },
    async execute(interaction) {
        const userId = interaction.options.getUser('user').id;
        const channel = interaction.channel;
        const channelInfo = channelData.channels[channel.id];

        if (!channelInfo || channelInfo.ownerId !== interaction.user.id) {
            return interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
        }

        await channel.permissionOverwrites.edit(userId, {
            Connect: true,
        });

        await interaction.reply({ content: 'User permitted to join the channel.', ephemeral: true });
    }
};
