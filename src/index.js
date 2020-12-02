import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { trailsRouter, newUserRouter, authRouter, nearbyRoute } from './routes';
import { isLoggedOn, addMiddlewares } from './middlewares';
import {
  findTrailsNear,
  findDistanceToTrail,
  ziptoLatLon,
} from './controllers';
import { getDifficultyIconPath, parseDifficultyFromNum } from './models';

const express = require('express');

require('dotenv').config();

if (!process.env.HIKING_PROJECT_KEY) {
  console.warn(
    `no HIKING_PROJECT_KEY set! Calls to get hiking paths wont work until this is set in the .env file. See env.sample.`,
  );
}
const app = express();

const port = process.env.PORT || 3000;
addMiddlewares(app);

// configure routes
app.use('/', authRouter);
app.use('/trails', trailsRouter);

app.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('nearby');
  } else {
    res.render('home', {
      user: req.user,
      showNewUserModal: req.showNewUserModal,
    });
  }
});

app.use('/newUser', newUserRouter);
app.post('/newUser', newUserRouter);

// nearby router
app.use('/nearby', nearbyRoute);

app.get('/profile', isLoggedOn, function (req, res) {
  const diffIcon = getDifficultyIconPath(
    parseDifficultyFromNum(req.user.difficultyLevel),
  );
  res.render('profile', { user: req.user, diffIcon: diffIcon });
});

app.post('/newuser', newUserRouter);

app.post('/search', async function redirectToSearch(req, res) {
  let gear = {
    icon: 'https://www.flaticon.com/svg/static/icons/svg/545/545674.svg',
    water: 'https://www.flaticon.com/svg/static/icons/svg/606/606797.svg',
    food: 'https://www.flaticon.com/svg/static/icons/svg/1046/1046857.svg',
    boots: 'https://www.flaticon.com/svg/static/icons/svg/2826/2826618.svg',
    poles: 'https://www.flaticon.com/svg/static/icons/svg/2325/2325148.svg',
    desInfo:
      'Hover over the icons to the right to see gear, water and food recommendations for this trail',
    desWaterThree: 'Bring 3 liters of water, trail is longer than eight miles',
    desWaterOne: 'Bring at least a liter of water',
    desFoodOne: 'Bring at least one snack',
    desFoodTwo: 'Bring at least two snacks, trail is longer than five miles',
    desBoots:
      'Wear a solid pair of hiking boots as the terrain can be challenging',
    desPoles: 'Bring hiking poles, the elevation gain is more than 700 feet',
  };
  const coordinate = await ziptoLatLon(req.body.zip);
  const results = await findTrailsNear(coordinate);
  results.forEach((element) => {
    element.distance = findDistanceToTrail(element, coordinate);
    element.time = element.length / 2 + 0.5 * (element.ascent / 1000);
  });
  console.log(results);
  console.log(req.body.minDifficulty);
  console.log(req.body.maxDifficulty);
  console.log(req.body.zip);
  res.render('search-results', { results: results, gear: gear });
});

// start server
app.listen(port, () => {
  console.log(`Trail Finder is listening on port http://localhost:${port}`);
});
