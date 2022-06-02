const {httpGetPlanets} = require('./planets.controller');
const express = require('express');
const planetsRouter = express.Router();

planetsRouter.get('/',httpGetPlanets);

module.exports = planetsRouter;