const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
const channelData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Claim the voice channel you are in'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        if (!channel) {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
            return;
        }

        const channelId = channel.id;
        const ownerId = interaction.user.id;

        if (channelData.channels[channelId]?.ownerId) {
            if (channelData.channels[channelId].ownerId === ownerId) {
                await interaction.reply({ content: 'You are already the owner of this channel.', ephemeral: true });
                return;
            } else {
                await interaction.reply({ content: 'This channel is already owned by someone else.', ephemeral: true });
                return;
            }
        }

        channelData.channels[channelId] = {
            ownerId: ownerId
        };
        saveData();

        await interaction.reply({ content: 'You have successfully claimed this voice channel!', ephemeral: true });
    },
};
