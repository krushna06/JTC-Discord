const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks the voice channel'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (channel) {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
            await interaction.reply({ content: 'Channel locked!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
