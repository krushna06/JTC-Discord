const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const dataPath = path.join(__dirname, '../data.json');
let guildData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2));

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const guildId = newState.guild.id;
        const guildConfig = guildData.guilds[guildId];

        if (!guildConfig) return;

        const jtcChannelId = guildConfig.jtcChannelId;

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

            guildConfig.channels[channel.id] = {
                ownerId: member.id
            };

            if (!guildData.totalChannelsCreated) {
                guildData.totalChannelsCreated = 0;
            }
            guildData.totalChannelsCreated++;

            if (!guildData.activeChannels) {
                guildData.activeChannels = {};
            }
            guildData.activeChannels[channel.id] = {
                createdAt: Date.now()
            };

            if (!guildConfig.activeChannelCount) {
                guildConfig.activeChannelCount = 0;
            }
            guildConfig.activeChannelCount++;

            if (!guildData.globalActiveChannelCount) {
                guildData.globalActiveChannelCount = 0;
            }
            guildData.globalActiveChannelCount++;

            saveData();
        }

        if (oldState.channelId) {
            const oldChannel = oldState.guild.channels.cache.get(oldState.channelId);

            if (!oldChannel) return;

            const channelInfo = guildData.guilds[guildId].channels[oldChannel.id];

            if (oldChannel.members.size === 0 && channelInfo) {
                await oldChannel.delete();

                delete guildData.guilds[guildId].channels[oldChannel.id];
                delete guildData.activeChannels[oldChannel.id];

                if (guildConfig.activeChannelCount > 0) {
                    guildConfig.activeChannelCount--;
                }

                if (guildData.globalActiveChannelCount > 0) {
                    guildData.globalActiveChannelCount--;
                }

                saveData();
            } else if (oldChannel.members.size > 0 && channelInfo) {
                if (channelInfo.ownerId === oldState.member.id) {
                    guildData.guilds[guildId].channels[oldChannel.id].ownerId = null;
                    saveData();
                }
            }
        }
    }
};
