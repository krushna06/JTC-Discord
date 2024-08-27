const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const buttonHandlers = {};
const buttonFiles = fs.readdirSync(path.join(__dirname, 'buttons')).filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
    const handler = require(`./buttons/${file}`);
    buttonHandlers[handler.id] = handler.execute;
}

const modalHandlers = {};
const modalFiles = fs.readdirSync(path.join(__dirname, 'modals')).filter(file => file.endsWith('.js'));
for (const file of modalFiles) {
    const handler = require(`./modals/${file}`);
    modalHandlers[handler.id] = handler.execute;
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (interaction.isCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (command) await command.execute(interaction);
            } else if (interaction.isButton()) {
                const handler = buttonHandlers[interaction.customId];
                if (handler) await handler(interaction);
                else await interaction.reply({ content: 'Unknown button action.', ephemeral: true });
            } else if (interaction.isModalSubmit()) {
                const handler = modalHandlers[interaction.customId];
                if (handler) await handler(interaction);
                else await interaction.reply({ content: 'Unknown modal action.', ephemeral: true });
            } else if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'regionSelect') {
                    const channel = interaction.member.voice.channel;
                    if (!channel) {
                        await interaction.reply({ content: 'You need to be in a voice channel to change its region.', ephemeral: true });
                        return;
                    }
                    const region = interaction.values[0];
                    await channel.setRTCRegion(region === 'automatic' ? null : region);
                    await interaction.reply({ content: `Voice channel region changed to ${region}.`, ephemeral: true });
                }
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error processing this interaction.', ephemeral: true });
        }
    }
};
