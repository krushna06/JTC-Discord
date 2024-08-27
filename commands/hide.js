const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hide')
        .setDescription('Hides the voice channel from everyone'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (channel) {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                ViewChannel: false,
            });
            await interaction.reply({ content: 'Channel hidden!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
