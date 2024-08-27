module.exports = {
    id: 'setLimitModal',
    async execute(interaction) {
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
    }
};
