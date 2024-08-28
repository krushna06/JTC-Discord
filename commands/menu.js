const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Sends the channel management menu with buttons')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to send the menu to')
                .setRequired(true)
                .addChannelTypes(0)
        ),
    async execute(interaction) {
        const targetChannel = interaction.options.getChannel('channel');

        if (!targetChannel || targetChannel.type !== 0) {
            return interaction.reply({ content: 'You need to specify a valid text channel.', ephemeral: true });
        }
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

        try {
            await targetChannel.send({
                embeds: [embed],
                components: [row1, row2, row3]
            });
            await interaction.reply({ content: `Menu has been sent to ${targetChannel}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error sending the menu to the specified channel.', ephemeral: true });
        }
    }
};
