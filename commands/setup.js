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
                .setDescription('Select a voice channel to set as the JTC (Join To Create) channel')
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildVoice))
        .addChannelOption(option =>
            option.setName('textchannel')
                .setDescription('Select a text channel to set up the control panel')
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: 'You need to be an administrator to use this command.', ephemeral: true });
        }

        const voiceChannelOption = interaction.options.getChannel('voicechannel');
        const textChannelOption = interaction.options.getChannel('textchannel');

        let jtcVoiceChannel;
        let controlPanelChannel;

        if (voiceChannelOption) {
            jtcVoiceChannel = voiceChannelOption;
        } else {
            let jtcCategory = interaction.guild.channels.cache.find(channel => channel.name === 'JTC' && channel.type === ChannelType.GuildCategory);
            if (!jtcCategory) {
                jtcCategory = await interaction.guild.channels.create({
                    name: 'JTC',
                    type: ChannelType.GuildCategory
                });
            }

            jtcVoiceChannel = await interaction.guild.channels.create({
                name: 'Join to Create',
                type: ChannelType.GuildVoice,
                parent: jtcCategory.id
            });
        }

        if (textChannelOption) {
            controlPanelChannel = textChannelOption;
        } else {
            if (!voiceChannelOption) {
                let jtcCategory = interaction.guild.channels.cache.find(channel => channel.name === 'JTC' && channel.type === ChannelType.GuildCategory);
                if (!jtcCategory) {
                    jtcCategory = await interaction.guild.channels.create({
                        name: 'JTC',
                        type: ChannelType.GuildCategory
                    });
                }

                controlPanelChannel = await interaction.guild.channels.create({
                    name: 'control-panel',
                    type: ChannelType.GuildText,
                    parent: jtcCategory.id
                });
            } else {
                controlPanelChannel = await interaction.guild.channels.create({
                    name: 'control-panel',
                    type: ChannelType.GuildText
                });
            }
        }

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
            .setDescription('Manage your voice channels using these buttons:')
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
