const guildService = require('../services/guildService');
const { successResponse, notFoundResponse } = require('../utils/responseHandler');

const getActiveChannels = (req, res) => {
    const { guildid } = req.params;
    const activeChannels = guildService.getActiveChannels(guildid);

    if (!activeChannels) {
        return notFoundResponse(res, 'Guild not found');
    }

    return successResponse(res, activeChannels, 'Active channels retrieved successfully');
};

module.exports = {
    getActiveChannels,
};
