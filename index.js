const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

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
        const { default: chalk } = await import('chalk');
        const { default: Table } = await import('cli-table3');

        console.log(chalk.yellow('Started refreshing global commands.'));

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );

        console.log(chalk.green('Successfully reloaded global commands.'));

        const table = new Table({
            head: ['Type', 'Count'],
            colWidths: [20, 10]
        });

        table.push(
            ['Commands', commands.length],
            ['Events', eventFiles.length]
        );

        console.log(table.toString());

    } catch (error) {
        const { default: chalk } = await import('chalk');
        console.error(chalk.red('Error reloading global commands:'), error);
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
    const { default: chalk } = await import('chalk');
    console.log(chalk.cyan(`Logged in as ${client.user.tag}`));
});

client.login(config.token);
