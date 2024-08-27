const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    setLimitModal: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('setLimitModal')
            .setTitle('Set User Limit');

        const userLimitInput = new TextInputBuilder()
            .setCustomId('userLimit')
            .setLabel('Enter the user limit (1-99):')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(2)
            .setPlaceholder('Enter a number')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(userLimitInput);

        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },

    renameModal: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('renameModal')
            .setTitle('Rename Voice Channel');

        const channelNameInput = new TextInputBuilder()
            .setCustomId('channelName')
            .setLabel('Enter the new channel name:')
            .setStyle(TextInputStyle.Short)
            .setMaxLength(100)
            .setPlaceholder('Enter a new name')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(channelNameInput);

        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
};
