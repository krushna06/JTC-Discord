const { banModal } = require('../modals/banModal');

module.exports = {
    id: 'ban',
    async execute(interaction) {
        await banModal(interaction);
    }
};
