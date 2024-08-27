const { Events, ModalSubmitInteraction, ButtonInteraction } = require('discord.js');
const { setLimitModal, renameModal } = require('./modals');

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
            const channel = interaction.member.voice.channel;
            if (!channel) {
                await interaction.reply({ content: 'You need to be in a voice channel to use this button.', ephemeral: true });
                return;
            }

            const buttonId = interaction.customId;

            try {
                switch (buttonId) {
                    case 'lock':
                        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
                        await interaction.reply({ content: 'Channel locked!', ephemeral: true });
                        break;

                    case 'unlock':
                        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: true });
                        await interaction.reply({ content: 'Channel unlocked!', ephemeral: true });
                        break;

                    case 'limit':
                        await setLimitModal(interaction);
                        break;

                    case 'name':
                        await renameModal(interaction);
                        break;

                    case 'invite':
                        await interaction.reply({ content: `Here is the invite link: ${channel.createInvite()}`, ephemeral: true });
                        break;

                    case 'ban':
                        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
                        await interaction.reply({ content: 'Channel banned!', ephemeral: true });
                        break;

                    case 'permit':
                        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: true });
                        await interaction.reply({ content: 'Channel permitted!', ephemeral: true });
                        break;

                    case 'hide':
                        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
                        await interaction.reply({ content: 'Channel hidden!', ephemeral: true });
                        break;

                    case 'unhide':
                        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: true });
                        await interaction.reply({ content: 'Channel unhidden!', ephemeral: true });
                        break;

                    default:
                        await interaction.reply({ content: 'Unknown action.', ephemeral: true });
                        break;
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error processing this button interaction.', ephemeral: true });
            }
        } else if (interaction instanceof ModalSubmitInteraction) {
            const modalId = interaction.customId;

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
            }
        }
    }
};
