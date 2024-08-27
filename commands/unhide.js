const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unhide')
        .setDescription('Unhides the voice channel for everyone'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (channel) {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                ViewChannel: true,
            });
            await interaction.reply({ content: 'Channel unhidden!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
