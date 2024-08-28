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
                ownerId: member.id
            };
            saveData();
        }

        if (oldState.channelId) {
            const oldChannel = oldState.guild.channels.cache.get(oldState.channelId);

            if (!oldChannel) return;

            const channelInfo = channelData.channels[oldChannel.id];

            if (oldChannel.members.size === 0 && channelInfo) {
                await oldChannel.delete();

                delete channelData.channels[oldChannel.id];
                saveData();
            } else if (oldChannel.members.size > 0 && channelInfo) {
                if (channelInfo.ownerId === oldState.member.id) {
                    channelData.channels[oldChannel.id].ownerId = null;
                    saveData();
                }
            }
        }
    }
};
