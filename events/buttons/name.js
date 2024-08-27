const { renameModal } = require('../modals/renameModal');

module.exports = {
    id: 'rename',
    async execute(interaction) {
        await renameModal(interaction);
    }
};
