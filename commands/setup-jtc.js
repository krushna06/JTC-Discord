const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
let guildData = require(dataPath);

// Function to save data to the JSON file
const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-jtc')
        .setDescription('Sets the specified voice channel as the JTC (Join To Create) channel for this guild.')
        .addChannelOption(option =>
            option.setName('voicechannel')
                .setDescription('The voice channel to set as JTC')
                .setRequired(true)),

    async execute(interaction) {
        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            // console.log(`User ${interaction.user.tag} tried to use setup-jtc without the required permissions.`);
            return interaction.reply({ content: 'You need to be an administrator to use this command.', ephemeral: true });
        }

        // Get the channel from options
        const channel = interaction.options.getChannel('voicechannel');

        // Log the channel object and its type for debugging
        // console.log(`Channel object: ${JSON.stringify(channel)}`);
        // console.log(`Channel type: ${channel.type}`);

        // Validate that the channel exists and is of type GUILD_VOICE (2)
        if (!channel) {
            // console.log('No channel was specified.');
            return interaction.reply({ content: 'No channel was specified. Please specify a valid voice channel.', ephemeral: true });
        }

        if (channel.type !== 2) { // 2 corresponds to GUILD_VOICE
            // console.log('The specified channel is not a valid voice channel.');
            return interaction.reply({ content: 'The specified channel is not a valid voice channel. Please specify a valid voice channel.', ephemeral: true });
        }

        // Initialize guild data if it does not exist
        if (!guildData.guilds) {
            guildData.guilds = {};
        }

        guildData.guilds[interaction.guild.id] = {
            jtcChannelId: channel.id,
            channels: {}
        };

        saveData();

        // console.log(`JTC channel set to ${channel.name} for guild ${interaction.guild.id}.`);

        return interaction.reply({ content: `JTC channel has been set to ${channel.name}.`, ephemeral: true });
    },
};
