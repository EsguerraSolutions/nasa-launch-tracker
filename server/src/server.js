const http = require('http');
require('dotenv').config();
const app = require('./app');
const {mongoConnect} = require('./services/mongo');
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

const {getPlanetData} = require('./models/planets.model');
const {getLaunchesData} = require('./models/launches.model');

async function startServer () {
    await mongoConnect();
    await getPlanetData();
    await getLaunchesData();
    server.listen(PORT, () => console.log(`Now listening at PORT:${PORT}`));
}

startServer();