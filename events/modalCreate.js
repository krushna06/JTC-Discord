const { setLimitModal, renameModal, banModal, permitModal, claimModal, transferModal } = require('./modalBuilder');

const handleModalSubmit = async (interaction, channelData) => {
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
};

module.exports = { handleModalSubmit };
