const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const dataPath = path.join(__dirname, '../data.json');
let channelData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(channelData, null, 2));

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const jtcChannelId = config.jtcChannelId;

        if (newState.channelId === jtcChannelId && !oldState.channelId) {
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

            channelData.channels[channel.id] = {
                ownerId: member.id,
                isTemporary: true
            };
            saveData();
        }

        if (oldState.channelId) {
            const oldChannel = oldState.guild.channels.cache.get(oldState.channelId);

            if (!oldChannel) return; 

            if (oldChannel.members.size === 0 && channelData.channels[oldChannel.id]?.isTemporary) {
                const ownerId = channelData.channels[oldChannel.id]?.ownerId;

                if (ownerId && ownerId === oldState.member.id) {
                    delete channelData.channels[oldChannel.id];
                    saveData();
                }

                await oldChannel.delete();
            }
        }
    }
};
