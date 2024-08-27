const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permit')
        .setDescription('Permits a user to join the voice channel')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to permit')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const user = interaction.options.getUser('user');
        if (channel) {
            await channel.permissionOverwrites.edit(user.id, {
                Connect: true,
            });
            await interaction.reply({ content: `${user.username} has been permitted to join the channel!`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
