const { transferModal } = require('../modals/transferModal');

module.exports = {
    id: 'transfer',
    async execute(interaction) {
        await transferModal(interaction);
    }
};
