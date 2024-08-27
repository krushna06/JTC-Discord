const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Sends the channel management panel'),
    async execute(interaction) {
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('lock').setLabel('Lock').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('unlock').setLabel('Unlock').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('hide').setLabel('Hide').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('unhide').setLabel('Unhide').setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('limit').setLabel('Set Limit').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('invite').setLabel('Invite').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('ban').setLabel('Ban').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('permit').setLabel('Permit').setStyle(ButtonStyle.Success)
        );

        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('name').setLabel('Rename').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('claim').setLabel('Claim').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('transfer').setLabel('Transfer').setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            content: 'Manage your voice channels using these buttons:',
            components: [row1, row2, row3],
            ephemeral: true
        });
    }
};
