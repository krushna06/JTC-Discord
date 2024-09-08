const infoService = require('../services/infoService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getInfo = (req, res) => {
    try {
        const commandFiles = infoService.getCommandFiles();
        successResponse(res, { numberOfCommands: commandFiles.length }, 'Info retrieved successfully');
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
