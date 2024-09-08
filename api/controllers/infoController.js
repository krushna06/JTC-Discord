const infoService = require('../services/infoService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getInfo = (req, res) => {
    try {
        const commandFiles = infoService.getCommandFiles();
        const data = infoService.getData();

        const response = {
            numberOfCommands: commandFiles.length,
            totalChannelsCreated: data.totalChannelsCreated,
            globalActiveChannelCount: data.globalActiveChannelCount
        };

        successResponse(res, response, 'Info retrieved successfully');
    } catch (err) {
        errorResponse(res, 'Unable to retrieve info');
    }
};

const getCommands = (req, res) => {
    try {
        const commandFiles = infoService.getCommandFiles();
        successResponse(res, { commands: commandFiles }, 'Commands retrieved successfully');
    } catch (err) {
        errorResponse(res, 'Unable to retrieve commands');
    }
};

module.exports = {
    getInfo,
    getCommands,
};
