const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
let data = require(dataPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfers ownership of the voice channel to another user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to transfer ownership to')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const newOwner = interaction.options.getUser('user');

        if (channel) {
            const channelData = data[channel.id];
            if (channelData && channelData.ownerId === interaction.member.id) {
                data[channel.id].ownerId = newOwner.id;
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                await interaction.reply({ content: `Ownership of the channel has been transferred to ${newOwner.username}!`, ephemeral: true });
            } else {
                await interaction.reply({ content: 'You are not the owner of this channel!', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
