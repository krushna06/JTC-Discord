const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of all available commands'),
    async execute(interaction) {
        const commands = interaction.client.commands;
        const commandList = commands.map(cmd => `**/${cmd.data.name}** - ${cmd.data.description}`).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle('Bot Command List')
            .setDescription('Here is a list of all available commands:')
            .setFooter({ text: 'Use /command_name for more details on a specific command.' })
            .addFields({ name: 'Commands', value: commandList || 'No commands available.' });

        try {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error retrieving the command list.', ephemeral: true });
        }
    }
};
