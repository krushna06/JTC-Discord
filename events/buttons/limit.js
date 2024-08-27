const { setLimitModal } = require('../modals/setLimitModal');

module.exports = {
    id: 'limit',
    async execute(interaction) {
        await setLimitModal(interaction);
    }
};
