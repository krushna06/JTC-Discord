const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Sends the channel management menu with buttons'),
    async execute(interaction) {
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('lock').setLabel('Lock').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('unlock').setLabel('Unlock').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('hide').setLabel('Hide').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('unhide').setLabel('Unhide').setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('setLimit').setLabel('Set Limit').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('invite').setLabel('Invite').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('ban').setLabel('Ban').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('permit').setLabel('Permit').setStyle(ButtonStyle.Secondary)
        );

        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rename').setLabel('Rename').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('claim').setLabel('Claim').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('transfer').setLabel('Transfer').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('region').setLabel('Change Region').setStyle(ButtonStyle.Secondary)
        );

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle('Voice Channel Management')
            .setDescription('Manage your voice channels using these buttons:')
            .setFooter({ text: 'Click the buttons below to perform actions on your voice channel.' });

        await interaction.reply({
            embeds: [embed],
            components: [row1, row2, row3],
            ephemeral: false
        });
    }
};
