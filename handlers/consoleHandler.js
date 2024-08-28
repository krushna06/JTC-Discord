let chalk, Table;

async function loadModules() {
    if (!chalk || !Table) {
        const [chalkModule, tableModule] = await Promise.all([
            import('chalk'),
            import('cli-table3')
        ]);
        chalk = chalkModule.default;
        Table = tableModule.default;
    }
}

async function logStatus(commandCount, eventCount) {
    await loadModules();
    
    const table = new Table({
        head: ['Type', 'Count'],
        colWidths: [20, 10]
    });

    table.push(
        ['Commands', commandCount],
        ['Events', eventCount]
    );

    console.log(table.toString());
}

async function logMessage(message, color) {
    await loadModules();

    switch (color) {
        case 'yellow':
            console.log(chalk.yellow(message));
            break;
        case 'green':
            console.log(chalk.green(message));
            break;
        case 'red':
            console.error(chalk.red(message));
            break;
        case 'cyan':
            console.log(chalk.cyan(message));
            break;
        default:
            console.log(message);
            break;
    }
}

module.exports = { logStatus, logMessage };
