const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data.json');
let channelData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    data: {
        name: 'rename',
    },
    async execute(interaction) {
        const channel = interaction.channel;
        const channelInfo = channelData.channels[channel.id];

        if (!channelInfo || channelInfo.ownerId !== interaction.user.id) {
            return interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
        }

        const modal = new ModalBuilder()
            .setCustomId('renameModal')
            .setTitle('Rename Channel');

        const nameInput = new TextInputBuilder()
            .setCustomId('channelName')
            .setLabel('New Channel Name')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(100);

        const actionRow = new ActionRowBuilder().addComponents(nameInput);

        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
};
