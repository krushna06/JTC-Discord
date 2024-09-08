const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

module.exports = (client) => {
    const guildRoutes = require('./routes/guildRoutes');
    const infoRoutes = require('./routes/infoRoutes');

    app.use('/api/v1/guild', guildRoutes);
    app.use('/api/v1', infoRoutes);

    app.listen(port, () => {
        console.log(`API server is running on http://localhost:${port}`);
    });
};
