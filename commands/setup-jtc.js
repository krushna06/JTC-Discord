const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
let guildData = require(dataPath);

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
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            // console.log(`User ${interaction.user.tag} tried to use setup-jtc without the required permissions.`);
            return interaction.reply({ content: 'You need to be an administrator to use this command.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('voicechannel');

        // console.log(`Channel object: ${JSON.stringify(channel)}`);
        // console.log(`Channel type: ${channel.type}`);

        if (!channel) {
            // console.log('No channel was specified.');
            return interaction.reply({ content: 'No channel was specified. Please specify a valid voice channel.', ephemeral: true });
        }

        if (channel.type !== 2) {
            // console.log('The specified channel is not a valid voice channel.');
            return interaction.reply({ content: 'The specified channel is not a valid voice channel. Please specify a valid voice channel.', ephemeral: true });
        }

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
