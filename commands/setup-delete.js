const { SlashCommandBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
let guildData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-delete')
        .setDescription('Deletes the JTC setup for this guild.'),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: 'You need to be an administrator to use this command.', ephemeral: true });
        }

        if (!guildData.guilds || !guildData.guilds[interaction.guild.id]) {
            return interaction.reply({ content: 'No JTC setup found for this guild.', ephemeral: true });
        }

        const setup = guildData.guilds[interaction.guild.id];
        const { jtcChannelId, controlPanelChannelId, jtcCategoryId } = setup;

        try {
            const jtcChannel = interaction.guild.channels.cache.get(jtcChannelId);
            if (jtcChannel) await jtcChannel.delete();
            
            const controlPanelChannel = interaction.guild.channels.cache.get(controlPanelChannelId);
            if (controlPanelChannel) await controlPanelChannel.delete();
            
            const jtcCategory = interaction.guild.channels.cache.get(jtcCategoryId);
            if (jtcCategory && jtcCategory.type === ChannelType.GuildCategory) {
                const channels = jtcCategory.children.cache;
                for (const channel of channels.values()) {
                    await channel.delete();
                }
                await jtcCategory.delete();
            }
        } catch (error) {
            console.error('Error deleting channels:', error);
            return interaction.reply({ content: 'There was an error deleting the channels.', ephemeral: true });
        }

        delete guildData.guilds[interaction.guild.id];
        saveData();

        return interaction.reply({ content: 'JTC setup has been deleted successfully.', ephemeral: true });
    },
};
