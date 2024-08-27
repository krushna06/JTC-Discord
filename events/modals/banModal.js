module.exports = {
    id: 'banModal',
    async execute(interaction) {
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
    }
};
