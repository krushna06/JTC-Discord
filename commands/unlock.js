const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks the voice channel, allowing anyone to join'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (channel) {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                Connect: true,
            });
            await interaction.reply({ content: 'Channel unlocked!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
