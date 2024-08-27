const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('limit')
        .setDescription('Sets a user limit for the voice channel')
        .addIntegerOption(option => 
            option.setName('limit')
                .setDescription('The user limit')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const limit = interaction.options.getInteger('limit');
        if (channel) {
            await channel.setUserLimit(limit);
            await interaction.reply({ content: `Channel user limit set to ${limit}`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
