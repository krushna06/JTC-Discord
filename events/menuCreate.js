const { ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
let channelData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

const handleMenuButtonInteraction = async (interaction) => {
    const buttonId = interaction.customId;
    const channel = interaction.member.voice.channel;

    if (channel) {
        const channelId = channel.id;
        const ownerId = channelData.channels[channelId]?.ownerId;

        if (!ownerId) {
            await interaction.reply({ content: 'This channel does not have an owner recorded in the data.', ephemeral: true });
            return;
        }

        try {
            if (buttonId === 'lock') {
                if (ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
                    await interaction.reply({ content: 'Channel locked!', ephemeral: true });
                }
            } else if (buttonId === 'unlock') {
                if (ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: true });
                    await interaction.reply({ content: 'Channel unlocked!', ephemeral: true });
                }
            } else if (buttonId === 'hide') {
                if (ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
                    await interaction.reply({ content: 'Channel hidden!', ephemeral: true });
                }
            } else if (buttonId === 'unhide') {
                if (ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: true });
                    await interaction.reply({ content: 'Channel unhidden!', ephemeral: true });
                }
            } else if (buttonId === 'setLimit') {
                if (ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Please provide a limit in the next modal.', ephemeral: true });
                }
            } else if (buttonId === 'invite') {
                if (ownerId !== interaction.user.id) {
                    await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                } else {
                    const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
                    await interaction.reply({ content: `Here is your invite link: ${invite.url}`, ephemeral: true });
                }
            } else if (buttonId === 'claim') {
                if (!channelData.channels[channelId]) {
                    channelData.channels[channelId] = { ownerId: interaction.user.id };
                    saveData();
                    await interaction.reply({ content: 'You have claimed ownership of this channel.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'This channel is already owned by someone else.', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'Unknown button.', ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error processing this interaction.', ephemeral: true });
        }
    } else {
        await interaction.reply({ content: 'You need to be in a voice channel to use this button.', ephemeral: true });
    }
};

module.exports = { handleMenuButtonInteraction };
