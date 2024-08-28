const { Events } = require('discord.js');
const path = require('path');
const { handleButtonInteraction } = require('./buttonCreate');
const { handleModalSubmit } = require('./modalCreate');

const dataPath = path.join(__dirname, '../data.json');
let channelData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            await handleButtonInteraction(interaction, channelData);
        } else if (interaction.isModalSubmit()) {
            await handleModalSubmit(interaction, channelData);
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'regionSelect') {
                const channel = interaction.member.voice.channel;
                if (!channel) {
                    await interaction.reply({ content: 'You need to be in a voice channel to change its region.', ephemeral: true });
                    return;
                }

                const region = interaction.values[0];
                try {
                    if (region === 'automatic') {
                        await channel.edit({ rtcRegion: null });
                        await interaction.reply({ content: 'Voice channel region set to automatic.', ephemeral: true });
                    } else {
                        await channel.setRTCRegion(region);
                        await interaction.reply({ content: `Voice channel region changed to ${region}.`, ephemeral: true });
                    }
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: 'There was an error while changing the region.', ephemeral: true });
                }
            }
        } else if (interaction.isCommand() && interaction.commandName === 'menu') {
            if (!interaction.member.permissions.has('MANAGE_GUILD')) {
                await interaction.reply({ content: 'You need the `Manage Server` permission to use this command.', ephemeral: true });
                return;
            }

            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('lock').setLabel('Lock').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('unlock').setLabel('Unlock').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('hide').setLabel('Hide').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('unhide').setLabel('Unhide').setStyle(ButtonStyle.Secondary)
            );

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('setLimit').setLabel('Set Limit').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('invite').setLabel('Invite').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('ban').setLabel('Ban').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('permit').setLabel('Permit').setStyle(ButtonStyle.Secondary)
            );

            const row3 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('rename').setLabel('Rename').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('claim').setLabel('Claim').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('transfer').setLabel('Transfer').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('region').setLabel('Change Region').setStyle(ButtonStyle.Secondary)
            );

            await interaction.reply({
                content: 'Manage your voice channels using these buttons:',
                components: [row1, row2, row3],
                ephemeral: false
            });
        }
    }
};
