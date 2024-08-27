module.exports = {
    id: 'renameModal',
    async execute(interaction) {
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
};
