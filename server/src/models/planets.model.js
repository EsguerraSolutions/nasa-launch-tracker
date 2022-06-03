
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

function getPlanetData() {
    new Promise((resolve,reject) => {

        const isHabitable = (planet) => planet.koi_disposition === 'CONFIRMED' 
            && planet.koi_insol > 0.36 
            && planet.koi_insol < 1.11
            && planet.koi_prad < 1.6;

        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
            .pipe(parse({
                comment : '#',
                columns : true
            }))
            .on('data',async (chunk)=> {
                if(isHabitable(chunk)) {
                    await savePlanet(chunk); 
                }
            })
            .on('error', (err) => {
                reject();
                console.log(err);
            })
            .on('end', async () => {
                const countPlanetsFound = (await getPlanets()).length;
                console.log('Streaming done');
                console.log(`Number of Habitable Planets : ${countPlanetsFound}`);
                console.log(await getPlanets()); //DEBUGGING OF CI TESTS
                resolve();
            });
    });
}

async function getPlanets () {
    return await planets.find({},'-__v -_id');
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName : planet.kepler_name
        },{
            keplerName : planet.kepler_name
        }, {
            upsert: true
        });
    }
    catch (err) {
        console.error(`Could not save planet, error: ${err}`);
    }
}

module.exports = {
    getPlanetData,
    getPlanets
}