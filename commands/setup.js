const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data.json');
let guildData = require(dataPath);

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up a new JTC category with a voice channel and a control panel.')
        .addChannelOption(option =>
            option.setName('voicechannel')
                .setDescription('The voice channel to set as JTC'))
        .addChannelOption(option =>
            option.setName('textchannel')
                .setDescription('The text channel to send the control panel')),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: 'You need to be an administrator to use this command.', ephemeral: true });
        }

        const voiceChannelOption = interaction.options.getChannel('voicechannel');
        const textChannelOption = interaction.options.getChannel('textchannel');

        if (guildData.guilds && guildData.guilds[interaction.guild.id]) {
            return interaction.reply({ content: 'JTC setup already exists for this guild.', ephemeral: true });
        }

        let jtcCategory = interaction.guild.channels.cache.find(channel => channel.name === 'JTC' && channel.type === ChannelType.GuildCategory);
        if (!jtcCategory) {
            jtcCategory = await interaction.guild.channels.create({
                name: 'JTC',
                type: ChannelType.GuildCategory
            });
        }

        const jtcVoiceChannel = voiceChannelOption || await interaction.guild.channels.create({
            name: 'Join to Create',
            type: ChannelType.GuildVoice,
            parent: jtcCategory.id
        });

        const controlPanelChannel = textChannelOption || await interaction.guild.channels.create({
            name: 'control-panel',
            type: ChannelType.GuildText,
            parent: jtcCategory.id
        });

        if (!guildData.guilds) {
            guildData.guilds = {};
        }

        guildData.guilds[interaction.guild.id] = {
            jtcChannelId: jtcVoiceChannel.id,
            controlPanelChannelId: controlPanelChannel.id,
            channels: {}
        };

        saveData();

        const embed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Voice Channel Management')
        .setDescription('Manage your voice channels using the buttons below:')
        .addFields(
            { name: '🔒 Lock', value: 'Locks the voice channel to prevent new users from joining.', inline: true },
            { name: '🔓 Unlock', value: 'Unlocks the voice channel to allow new users to join.', inline: true },
            { name: '👁️ Hide', value: 'Hides the voice channel from the server.', inline: true },
            { name: '👁️‍🗨️ Unhide', value: 'Unhides the voice channel to make it visible in the server.', inline: true },
            { name: '🔢 Set Limit', value: 'Sets a user limit for the voice channel.', inline: true },
            { name: '📩 Invite', value: 'Sends an invite link for the voice channel.', inline: true },
            { name: '🚫 Ban', value: 'Bans a user from the voice channel.', inline: true },
            { name: '✅ Permit', value: 'Permits a user to join the voice channel.', inline: true },
            { name: '✏️ Rename', value: 'Renames the voice channel.', inline: true },
            { name: '🖊️ Claim', value: 'Claims ownership of the voice channel.', inline: true },
            { name: '🔄 Transfer', value: 'Transfers ownership of the voice channel.', inline: true },
            { name: '🌍 Region', value: 'Changes the voice channel region.', inline: true }
        )
        .setFooter({ text: 'Click the buttons below to perform actions on your voice channel.' });
    

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('lock').setEmoji('1278197399508226174').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('unlock').setEmoji('1278197548133257226').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('hide').setEmoji('1278197617217765498').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('unhide').setEmoji('1278197680509681717').setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('setLimit').setEmoji('1278197732124786719').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('invite').setEmoji('1278197927839268864').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('ban').setEmoji('1278197883170062421').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('permit').setEmoji('1278198032948793418').setStyle(ButtonStyle.Secondary)
        );

        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rename').setEmoji('1278198084274491433').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('claim').setEmoji('1278198179799633941').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('transfer').setEmoji('1030227495892557826').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('region').setEmoji('1278198135729950762').setStyle(ButtonStyle.Secondary)
        );

        try {
            await controlPanelChannel.send({
                embeds: [embed],
                components: [row1, row2, row3]
            });
            await interaction.reply({ content: `JTC setup is complete. Voice channel created as 'Join to Create' and control panel is in #${controlPanelChannel.name}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error setting up the JTC channels.', ephemeral: true });
        }
    },
};
