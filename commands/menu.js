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
            new ButtonBuilder().setCustomId('lock').setEmoji('1278197399508226174').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('unlock').setEmoji('1278197548133257226').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('hide').setEmoji('1278197617217765498').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('unhide').setEmoji('1278197680509681717').setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('setLimit').setEmoji('1278197732124786719').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('invite').setEmoji('1278197927839268864').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('ban').setEmoji('1278197883170062421').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('permit').setEmoji('1278198032948793418').setStyle(ButtonStyle.Secondary)
        );

        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rename').setEmoji('1278198084274491433').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('claim').setEmoji('1278198179799633941').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('transfer').setEmoji('1030227495892557826').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('region').setEmoji('1278198135729950762').setStyle(ButtonStyle.Secondary)
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
