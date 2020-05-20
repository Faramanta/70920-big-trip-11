import moment from "moment";
import {SortType} from "../const.js";

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const pointTime = (timestamp) => {
  return moment(timestamp).format(`HH:mm`);
};
export const pointISOTime = (timestamp) => {
  return moment(timestamp).format(`YYYY-mm-DTHH:mm`);
};

export const pointDuration = (start, end) => {
  const pointStart = moment(start);
  const pointEnd = moment(end);
  const duration = pointEnd.diff(pointStart); // продолжительность точки

  return pointDurationFormat(duration);
};

export const pointDurationFormat = (duration) => {
  const pointDurDay = moment.duration(duration).days(); // количество дней
  const pointDurHour = moment.duration(duration).hours(); // количество часов
  const pointDurMin = moment.duration(duration).minutes(); // количество минут

  const days = pointDurDay > 0 ? castTimeFormat(pointDurDay) + `D` : ``;
  const hours = pointDurHour > 0 ? castTimeFormat(pointDurHour) + `H` : ``;
  const minutes = pointDurMin > 0 ? castTimeFormat(pointDurMin) + `M` : `00M`;

  return `${days} ${hours} ${minutes}`;
};

export const getPointDuration = (start, end) => {
  const pointStart = moment(start);
  const pointEnd = moment(end);
  return pointEnd.diff(pointStart);
};

export const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  const showingPoints = points.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedPoints = showingPoints.sort((a, b) => a.startTimestamp > b.startTimestamp);
      break;
    case SortType.TIME:
      sortedPoints = showingPoints.sort((a, b) => {
        return getPointDuration(b.startTimestamp, b.endTimestamp) - getPointDuration(a.startTimestamp, a.endTimestamp);
      });
      break;
    case SortType.PRICE:
      sortedPoints = showingPoints.sort((a, b) => b.price - a.price);
      break;
  }

  return sortedPoints;
};

export const getGroupedPoints = (points) => {
  const pointsGroups = new Map();
  points.forEach((point) => {
    const startPointDate = new Date(point.startTimestamp);

    const startDay = new Date(startPointDate.getFullYear(), startPointDate.getMonth(), startPointDate.getDate(), 0, 0, 0, 0);
    const endDay = new Date(startPointDate.getFullYear(), startPointDate.getMonth(), startPointDate.getDate(), 23, 59, 59, 999);

    const startTimestampDay = startDay.getTime();
    const endTimestampDay = endDay.getTime();


    if (!pointsGroups.has(startTimestampDay)) {
      const dayPoints = points.filter((point1) => {

        return startTimestampDay <= point1.startTimestamp && point1.startTimestamp <= endTimestampDay;

      });

      pointsGroups.set(startTimestampDay, dayPoints);
    }
  });

  return pointsGroups;
};

export const getPreparedPoints = (points, sortType = SortType.DEFAULT) => {
  const sortedPoints = getSortedPoints(points, sortType);
  const groupedPoints = getGroupedPoints(sortedPoints);

  return groupedPoints;
};

export const getPointsType = (points) => {
  return Array.from(new Set(points.map((point) => point.pointType)));
};

export const calculateTypeCount = (points, type) => {
  return points.filter((it) => it.pointType === type).length;
};

export const calculateTypePrice = (points, type) => {
  const chartTypePoints = points.filter((it) => it.pointType === type);

  return chartTypePoints.reduce((accumulator, item) => accumulator + item.price, 0);
};

export const calculateTypeDuration = (points, type) => {
  const chartDurationPoints = points.filter((it) => it.pointType === type);
  const chartDurationPointsTimestamp = chartDurationPoints.reduce((accumulator, item) => accumulator + getPointDuration(item.startTimestamp, item.endTimestamp), 0);
  return moment.duration(chartDurationPointsTimestamp).asMilliseconds();
};

export const capitalizeFirstLetter = (str) => {
  if (str.length === 0) {
    return ``;
  }
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

// выбрать все офферы одного типа
export const getTypeOffers = (offers, typeName) => {
  return offers.filter((offer) => offer.type === typeName);
};
