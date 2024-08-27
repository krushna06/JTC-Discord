const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    id: 'region',
    async execute(interaction) {
        const regions = [
            'brazil', 'europe', 'hongkong', 'india', 'japan', 'london', 'middleeast', 'northamerica',
            'rus', 'singapore', 'southafrica', 'sydney', 'us-central', 'us-east', 'us-south', 'us-west'
        ];

        const options = regions.map(region => new StringSelectMenuOptionBuilder()
            .setLabel(region.charAt(0).toUpperCase() + region.slice(1))
            .setValue(region)
        );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('regionSelect')
            .setPlaceholder('Select a region')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: 'Select the new region for the voice channel:',
            components: [row],
            ephemeral: true
        });
    }
};
