module.exports = {
    id: 'unhide',
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const channelId = channel.id;
        const channelData = require('../../data.json');
        const ownerId = channelData.channels[channelId]?.ownerId;

        if (ownerId && ownerId !== interaction.user.id) {
            await interaction.reply({ content: 'You are not the owner of this channel.', ephemeral: true });
        } else {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: true });
            await interaction.reply({ content: 'Channel unhidden!', ephemeral: true });
        }
    }
};
