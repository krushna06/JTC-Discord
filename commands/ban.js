const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from joining the voice channel')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const user = interaction.options.getUser('user');
        if (channel) {
            await channel.permissionOverwrites.edit(user.id, {
                Connect: false,
            });
            await interaction.reply({ content: `${user.username} has been banned from the channel!`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
