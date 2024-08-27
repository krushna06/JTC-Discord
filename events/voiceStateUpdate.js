const config = require('../config.json');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const jtcChannelId = config.jtcChannelId;

        if (newState.channelId === jtcChannelId) {
            const member = newState.member;
            const guild = member.guild;

            const channel = await guild.channels.create({
                name: `${member.user.username}'s Channel`,
                type: 2,
                parent: newState.channel.parentId,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: ['ViewChannel', 'Connect', 'ManageChannels', 'MuteMembers', 'DeafenMembers'],
                    },
                    {
                        id: guild.roles.everyone,
                        deny: ['Connect'],
                    },
                ],
            });

            await member.voice.setChannel(channel);
        }

        if (
            oldState.channelId &&
            oldState.channel.members.size === 0 &&
            oldState.channel.name.endsWith("'s Channel")
        ) {
            await oldState.channel.delete();
        }
    }
};
