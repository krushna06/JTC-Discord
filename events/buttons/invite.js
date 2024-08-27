module.exports = {
    id: 'invite',
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (channel) {
            const invite = await channel.createInvite();
            await interaction.reply({ content: `Here is the invite link: ${invite.url}`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'You need to be in a voice channel to create an invite.', ephemeral: true });
        }
    }
};
