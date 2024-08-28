const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const setLimitModal = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('setLimitModal')
        .setTitle('Set Channel Limit');

    const userLimitInput = new TextInputBuilder()
        .setCustomId('userLimit')
        .setLabel('Enter the new user limit (1-99):')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(userLimitInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
};

const renameModal = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('renameModal')
        .setTitle('Rename Channel');

    const channelNameInput = new TextInputBuilder()
        .setCustomId('channelName')
        .setLabel('Enter the new channel name:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(channelNameInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
};

const banModal = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('banModal')
        .setTitle('Ban User');

    const userIdInput = new TextInputBuilder()
        .setCustomId('userId')
        .setLabel('Enter the user ID to ban:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(userIdInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
};

const permitModal = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('permitModal')
        .setTitle('Permit User');

    const userIdInput = new TextInputBuilder()
        .setCustomId('userId')
        .setLabel('Enter the user ID to permit:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(userIdInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
};

const claimModal = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('claimModal')
        .setTitle('Claim Ownership');

    const channelIdInput = new TextInputBuilder()
        .setCustomId('channelId')
        .setLabel('Enter the voice channel ID to claim:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(channelIdInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
};

const transferModal = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('transferModal')
        .setTitle('Transfer Ownership');

    const userIdInput = new TextInputBuilder()
        .setCustomId('userId')
        .setLabel('Enter the user ID to transfer ownership to:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(userIdInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
};

module.exports = {
    setLimitModal,
    renameModal,
    banModal,
    permitModal,
    claimModal,
    transferModal
};
