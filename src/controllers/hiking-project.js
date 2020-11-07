import axios from 'axios';

export class HikingProjectOptions {
  constructor({ maxDistance, maxResults, sort, minLength, minStars }) {
    if (maxDistance) {
      this.setMaxDistance(maxDistance);
    }

    if (maxResults) {
      this.setMaxResults(maxResults);
    }

    if (sort) {
      this.setSort(sort);
    }

    if (minLength) {
      this.setMinLength(minLength);
    }

    if (minStars) {
      this.setMinStars(minStars);
    }
  }

  setMaxDistance(maxDistance) {
    if (maxDistance > 200) {
      throw new Error('Cant find trails over 200 miles');
    }

    this.setMaxDistance = maxDistance;
  }

  setMaxResults(maxResults) {
    this.maxResults = maxResults;
  }

  setSort(sort) {
    if (!/quality|distance/.test(sort)) {
      throw new Error(`Unknown sort value enum!`);
    }
    this.sort = sort;
  }

  setMinLength(minLength) {
    this.minLength = minLength;
  }

  setMinStars(minStars) {
    if (minStars < 0 || minStars > 4) {
      throw new Error('min stars out or range 0-4');
    }

    this.minStars = minStars;
  }
}

export function findTrailsNear(coordinates, options = {}) {
  options.key = process.env.HIKING_PROJECT_KEY;
  options.lat = coordinates.latitude;
  options.lon = coordinates.longitude;

  return axios
    .get(`https://www.hikingproject.com/data/get-trails`, {
      params: options,
    })
    .then(({ data }) => data?.trails ?? [])
    .catch((err) => {
      console.error(err);
      return [];
    });
}
