import {FilterType} from "../const.js";

export const getPointsByFilter = (points, filterType) => {
  const today = new Date().getTime();
  let filteredPoints = [];

  switch (filterType) {
    case FilterType.EVERYTHING:
      filteredPoints = points;
      break;
    case FilterType.FUTURE:
      filteredPoints = points.filter((pointItem) => pointItem.startTimestamp > today);
      break;
    case FilterType.PAST:
      filteredPoints = points.filter((pointItem) => pointItem.startTimestamp < today);
      break;
  }

  return filteredPoints;
};
