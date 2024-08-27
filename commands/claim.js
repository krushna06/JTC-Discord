const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
let data = require(dataPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Claims ownership of the voice channel'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (channel) {
            const channelData = data[channel.id];
            if (channelData && channelData.ownerId) {
                if (interaction.member.id !== channelData.ownerId) {
                    return interaction.reply({ content: 'You are not the owner of this channel!', ephemeral: true });
                }
                await interaction.reply({ content: 'You already own this channel!', ephemeral: true });
            } else {
                data[channel.id] = { ownerId: interaction.member.id };
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                await interaction.reply({ content: 'You have claimed ownership of this channel!', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
