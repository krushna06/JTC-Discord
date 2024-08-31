const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of all available commands'),
    async execute(interaction) {
        const commands = interaction.client.commands;
        const commandList = commands.map(cmd => `**/${cmd.data.name}** - ${cmd.data.description}`);

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle('Bot Command List')
            .setDescription('Here is a list of all available commands:')
            .setFooter({ text: 'Use /command_name for more details on a specific command.' });

        const chunkSize = 1024;
        let currentChunk = '';

        for (const command of commandList) {
            if ((currentChunk + command).length > chunkSize) {
                embed.addFields({ name: 'Commands', value: currentChunk });
                currentChunk = '';
            }
            currentChunk += command + '\n';
        }

        if (currentChunk) {
            embed.addFields({ name: 'Commands', value: currentChunk });
        }

        try {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error retrieving the command list.', ephemeral: true });
        }
    }
};
