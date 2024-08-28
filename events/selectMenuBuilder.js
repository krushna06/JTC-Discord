const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const createRegionSelectMenu = () => {
    const regions = [
        'automatic', 'brazil', 'hongkong', 'india', 'japan', 'rotterdam', 'russia', 'singapore',
        'southafrica', 'sydney', 'us-central', 'us-east', 'us-south', 'us-west'
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

    return row;
};

module.exports = {
    createRegionSelectMenu
};
