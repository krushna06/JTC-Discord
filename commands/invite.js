const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Creates an invite link for your current voice channel'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (channel) {
            try {
                const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
                await interaction.reply({ content: `Here is your invite link: ${invite.url}`, ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Failed to create an invite link.', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
    },
};
