const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

function setLimitModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('setLimitModal')
        .setTitle('Set Channel Limit');

    const limitInput = new TextInputBuilder()
        .setCustomId('userLimit')
        .setLabel('Max users (1-99)')
        .setStyle(TextInputStyle.Short);

    const actionRow = new ActionRowBuilder().addComponents(limitInput);

    modal.addComponents(actionRow);

    return interaction.showModal(modal);
}

function renameModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('renameModal')
        .setTitle('Rename Channel');

    const nameInput = new TextInputBuilder()
        .setCustomId('channelName')
        .setLabel('New Channel Name')
        .setStyle(TextInputStyle.Short);

    const actionRow = new ActionRowBuilder().addComponents(nameInput);

    modal.addComponents(actionRow);

    return interaction.showModal(modal);
}

function banModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('banModal')
        .setTitle('Ban User from Channel');

    const userIdInput = new TextInputBuilder()
        .setCustomId('userId')
        .setLabel('User ID')
        .setStyle(TextInputStyle.Short);

    const actionRow = new ActionRowBuilder().addComponents(userIdInput);

    modal.addComponents(actionRow);

    return interaction.showModal(modal);
}

function permitModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('permitModal')
        .setTitle('Permit User to Channel');

    const userIdInput = new TextInputBuilder()
        .setCustomId('userId')
        .setLabel('User ID')
        .setStyle(TextInputStyle.Short);

    const actionRow = new ActionRowBuilder().addComponents(userIdInput);

    modal.addComponents(actionRow);

    return interaction.showModal(modal);
}

module.exports = { setLimitModal, renameModal, banModal, permitModal };
