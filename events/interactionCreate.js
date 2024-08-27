const { Events, ButtonInteraction, ModalSubmitInteraction, StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { setLimitModal, renameModal, banModal, permitModal, claimModal, transferModal } = require('./modals');

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
            const buttonId = interaction.customId;
            const channel = interaction.member.voice.channel;

            if (channel) {
                const channelId = channel.id;
                const ownerId = channelData.channels[channelId]?.ownerId;

                try {
                    if (buttonId === 'lock') {
                        if (ownerId && ownerId !== interaction.user.id) {
                            await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                        } else {
                            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
                            await interaction.reply({ content: 'Channel locked!', ephemeral: true });
                        }
                    } else if (buttonId === 'unlock') {
                        if (ownerId && ownerId !== interaction.user.id) {
                            await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                        } else {
                            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: true });
                            await interaction.reply({ content: 'Channel unlocked!', ephemeral: true });
                        }
                    } else if (buttonId === 'hide') {
                        if (ownerId && ownerId !== interaction.user.id) {
                            await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                        } else {
                            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
                            await interaction.reply({ content: 'Channel hidden!', ephemeral: true });
                        }
                    } else if (buttonId === 'unhide') {
                        if (ownerId && ownerId !== interaction.user.id) {
                            await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                        } else {
                            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: true });
                            await interaction.reply({ content: 'Channel unhidden!', ephemeral: true });
                        }
                    } else if (buttonId === 'limit') {
                        await setLimitModal(interaction);
                    } else if (buttonId === 'name') {
                        await renameModal(interaction);
                    } else if (buttonId === 'invite') {
                        const invite = await channel.createInvite();
                        await interaction.reply({ content: `Here is the invite link: ${invite.url}`, ephemeral: true });
                    } else if (buttonId === 'ban') {
                        await banModal(interaction);
                    } else if (buttonId === 'permit') {
                        await permitModal(interaction);
                    } else if (buttonId === 'claim') {
                        if (channelData.channels[channelId] && channelData.channels[channelId].ownerId) {
                            await interaction.reply({ content: 'This channel is already claimed.', ephemeral: true });
                        } else {
                            channelData.channels[channelId] = { ownerId: interaction.user.id };
                            saveData();
                            await interaction.reply({ content: `You have claimed ownership of the voice channel ${channel.name}.`, ephemeral: true });
                        }
                    } else if (buttonId === 'transfer') {
                        await transferModal(interaction);
                    } else if (buttonId === 'region') {
                        // Create and send the region selection menu
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
                    } else {
                        await interaction.reply({ content: 'Unknown action.', ephemeral: true });
                    }
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: 'There was an error processing this button interaction.', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'You need to be in a voice channel to use this button.', ephemeral: true });
            }
        } else if (interaction.isModalSubmit()) {
            const modalId = interaction.customId;

            try {
                if (modalId === 'setLimitModal') {
                    const userLimit = parseInt(interaction.fields.getTextInputValue('userLimit'), 10);
                    if (isNaN(userLimit) || userLimit < 1 || userLimit > 99) {
                        await interaction.reply({ content: 'Invalid limit. Please provide a number between 1 and 99.', ephemeral: true });
                    } else {
                        const channel = interaction.member.voice.channel;
                        if (channel) {
                            await channel.setUserLimit(userLimit);
                            await interaction.reply({ content: `Channel user limit set to ${userLimit}`, ephemeral: true });
                        } else {
                            await interaction.reply({ content: 'You need to be in a voice channel to use this modal.', ephemeral: true });
                        }
                    }
                } else if (modalId === 'renameModal') {
                    const newName = interaction.fields.getTextInputValue('channelName');
                    if (newName.length === 0) {
                        await interaction.reply({ content: 'Invalid name. Please provide a non-empty name.', ephemeral: true });
                    } else {
                        const channel = interaction.member.voice.channel;
                        if (channel) {
                            await channel.setName(newName);
                            await interaction.reply({ content: `Channel name changed to ${newName}`, ephemeral: true });
                        } else {
                            await interaction.reply({ content: 'You need to be in a voice channel to use this modal.', ephemeral: true });
                        }
                    }
                } else if (modalId === 'banModal') {
                    const userId = interaction.fields.getTextInputValue('userId');
                    const user = await interaction.guild.members.fetch(userId).catch(() => null);
                    if (!user) {
                        await interaction.reply({ content: 'Invalid user ID.', ephemeral: true });
                        return;
                    }
                    const channel = interaction.member.voice.channel;
                    if (channel) {
                        await channel.permissionOverwrites.edit(user, { Connect: false });
                        await interaction.reply({ content: `User <@${userId}> banned from the channel.`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: 'You need to be in a voice channel to use this modal.', ephemeral: true });
                    }
                } else if (modalId === 'permitModal') {
                    const userId = interaction.fields.getTextInputValue('userId');
                    const user = await interaction.guild.members.fetch(userId).catch(() => null);
                    if (!user) {
                        await interaction.reply({ content: 'Invalid user ID.', ephemeral: true });
                        return;
                    }
                    const channel = interaction.member.voice.channel;
                    if (channel) {
                        await channel.permissionOverwrites.edit(user, { Connect: true });
                        await interaction.reply({ content: `User <@${userId}> permitted to join the channel.`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: 'You need to be in a voice channel to use this modal.', ephemeral: true });
                    }
                } else if (modalId === 'claimModal') {
                    const channelId = interaction.fields.getTextInputValue('channelId');
                    if (!channelData.channels[channelId] || !interaction.guild.channels.cache.has(channelId)) {
                        await interaction.reply({ content: 'Invalid channel ID or not a voice channel.', ephemeral: true });
                        return;
                    }
                    const channel = interaction.guild.channels.cache.get(channelId);
                    if (channel && channel.type === 'GUILD_VOICE') {
                        if (channelData.channels[channelId].ownerId) {
                            await interaction.reply({ content: 'This channel already has an owner.', ephemeral: true });
                        } else {
                            channelData.channels[channelId].ownerId = interaction.user.id;
                            saveData();
                            await interaction.reply({ content: `You have claimed ownership of the voice channel ${channel.name}.`, ephemeral: true });
                        }
                    } else {
                        await interaction.reply({ content: 'Invalid channel ID or not a voice channel.', ephemeral: true });
                    }
                } else if (modalId === 'transferModal') {
                    const userId = interaction.fields.getTextInputValue('userId');
                    const user = await interaction.guild.members.fetch(userId).catch(() => null);
                    if (!user) {
                        await interaction.reply({ content: 'Invalid user ID.', ephemeral: true });
                        return;
                    }
                    const channel = interaction.member.voice.channel;
                    if (channel) {
                        const channelId = channel.id;
                        if (channelData.channels[channelId]?.ownerId === interaction.user.id) {
                            channelData.channels[channelId].ownerId = userId;
                            saveData();
                            await interaction.reply({ content: `Ownership of the voice channel ${channel.name} has been transferred to <@${userId}>.`, ephemeral: true });
                        } else {
                            await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
                        }
                    } else {
                        await interaction.reply({ content: 'You need to be in a voice channel to use this modal.', ephemeral: true });
                    }
                } else {
                    await interaction.reply({ content: 'Unknown modal.', ephemeral: true });
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error processing this modal.', ephemeral: true });
            }
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'regionSelect') {
                const channel = interaction.member.voice.channel;
                if (!channel) {
                    await interaction.reply({ content: 'You need to be in a voice channel to change its region.', ephemeral: true });
                    return;
                }

                const region = interaction.values[0];
                try {
                    await channel.setRTCRegion(region);
                    await interaction.reply({ content: `Voice channel region changed to ${region}.`, ephemeral: true });
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: 'There was an error while changing the region.', ephemeral: true });
                }
            }
        }
    }
};
