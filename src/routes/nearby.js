const express = require('express');
const router = express.Router();
import {
  findTrailsNear,
  findDistanceToTrail,
  ziptoLatLon,
} from '../controllers';
import {
  Coordinate,
  DirectionsFactory,
  parseDifficultyFromObject,
} from '../models';

const gear = {
  icon: 'https://www.flaticon.com/svg/static/icons/svg/545/545674.svg',
  water: 'https://www.flaticon.com/svg/static/icons/svg/606/606797.svg',
  food: 'https://www.flaticon.com/svg/static/icons/svg/1046/1046857.svg',
  boots: 'https://www.flaticon.com/svg/static/icons/svg/2826/2826618.svg',
  poles: 'https://www.flaticon.com/svg/static/icons/svg/2325/2325148.svg',
  desJust: 'Search for Trails based on your fitness level',
  desInfo:
    'Hover over the icons to the right to see gear recommendations for this trail',
  desWaterThree: 'Bring 3 liters of water, trail is longer than eight miles',
  desWaterOne: 'Bring at least a liter of water',
  desFoodOne: 'Bring at least one snack',
  desFoodTwo: 'Bring at least two snacks, trail is longer than five miles',
  desBoots:
    'Wear a solid pair of hiking boots as the terrain can be challenging',
  desPoles: 'Bring hiking poles, the elevation gain is more than 700 feet',
};

const defaults = {
  defaultZip: 97210,
  defaultMax: 5,
  defaultMin: 0,
  defaultLimit: 10,
  deafaultJustForYou: null,
  results: [],
  gear,
};

router
  .get('/', async function (req, res) {
    let results = [];

    if (req.query.zip) {
      const coordinate = await ziptoLatLon(req.query.zip);
      results = await findTrailsNear(coordinate);
      results.forEach((result) => {
        const trailLocation = new Coordinate(result.latitude, result.longitude);
        result.distance = findDistanceToTrail(result, coordinate);
        result.time = result.length / 2 + 0.5 * (result.ascent / 1000);
        result.directionLink = DirectionsFactory.createGoogleDirectionLink(
          trailLocation,
        );
        result.difficulty = parseDifficultyFromObject(result);
      });
    }

    results = results.filter(
      (result) =>
        result.difficulty <= req.query.maxDifficulty &&
        result.difficulty >= req.query.minDifficulty,
    );

    if (req.query.justForYou === 'on' && req.user !== undefined) {
      results = results.filter(
        (result) => result.difficulty == req.user.difficultyLevel,
      );
    }

    res.render(
      'nearby',
      Object.assign({}, defaults, {
        user: req.user,
        results,
      }),
    );
  })
  .post('/', async function (req, res) {
    const zip = req.body.zip || defaults.defaultZip;
    const limit = req.body.limit || defaults.defaultLimit;
    const minDifficulty = req.body.min || defaults.defaultMin;
    const maxDifficulty = req.body.max || defaults.defaultMax;
    const justForYou = req.body.justForYou || defaults.JustForYou;

    res.redirect(
      `/nearby?zip=${zip}&limit=${limit}&minDifficulty=${minDifficulty}&maxDifficulty=${maxDifficulty}&justForYou=${justForYou}`,
    );
  });

export const nearbyRouter = router;
