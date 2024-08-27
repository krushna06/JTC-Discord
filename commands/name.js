const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('name')
        .setDescription('Renames the voice channel')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The new name for the channel')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const newName = interaction.options.getString('name');
        if (channel) {
            await channel.setName(newName);
            await interaction.reply({ content: `Channel name changed to ${newName}`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
