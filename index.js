const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const { logStatus, logMessage } = require('./handlers/consoleHandler');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        await logMessage('Started refreshing global commands.', 'yellow');

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );

        await logMessage('Successfully reloaded global commands.', 'green');

        const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
        await logStatus(commands.length, eventFiles.length);

    } catch (error) {
        await logMessage('Error reloading global commands:', 'red');
        console.error(error);
    }
})();

const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.once('ready', async () => {
    await logMessage(`Logged in as ${client.user.tag}`, 'cyan');

    if (config.api) {
        require('./server')(client);
    } else {
        console.log('API server is disabled in config.');
    }
});

client.login(config.token);
