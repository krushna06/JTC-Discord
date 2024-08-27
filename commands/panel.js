const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Sends the channel management panel'),
    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('lock').setLabel('Lock').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('unlock').setLabel('Unlock').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('limit').setLabel('Set Limit').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('name').setLabel('Rename').setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            content: 'Manage your voice channels using these buttons:',
            components: [row],
            ephemeral: true,
        });
    }
};
