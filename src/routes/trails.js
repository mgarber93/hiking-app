import express from 'express';
import { Coordinate } from '../models';
import { findTrailsNear, HikingProjectOptions } from '../controllers';

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const {
      latitude,
      longitude,
      maxDistance,
      maxResults,
      sort,
      minLength,
      minStars,
    } = req.query;
    const coordinate = new Coordinate(latitude, longitude);
    const options = new HikingProjectOptions({
      maxDistance,
      maxResults,
      sort,
      minLength,
      minStars,
    });
    const trails = await findTrailsNear(coordinate, options);
    return res.json({
      trails,
    });
  } catch (e) {
    console.warn(e);
    res.sendStatus(400);
  }
});

export const trailsRouter = router;
