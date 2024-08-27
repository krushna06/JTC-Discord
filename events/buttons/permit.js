const { permitModal } = require('../modals/permitModal');

module.exports = {
    id: 'permit',
    async execute(interaction) {
        await permitModal(interaction);
    }
};
