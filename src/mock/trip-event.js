import {PointType, POINT_TYPES, CITIES} from "../const.js";
import {getTypeOffers} from "../utils/common.js";

export const DefaultOffers = [{
  type: PointType.FLIGHT,
  title: `Add meal`,
  price: 50,
}, {
  type: PointType.CHECKIN,
  title: `Add breakfast`,
  price: 50,
}, {
  type: PointType.FLIGHT,
  title: `Add luggage`,
  price: 50,
}, {
  type: PointType.SIGHTSEEING,
  title: `Book tickets`,
  price: 40,
}, {
  type: PointType.SIGHTSEEING,
  title: `Lunch in city`,
  price: 30,
}, {
  type: PointType.TAXI,
  title: `Order Uber`,
  price: 20,
}, {
  type: PointType.DRIVE,
  title: `Rent a car`,
  price: 200,
}, {
  type: PointType.FLIGHT,
  title: `Switch to comfort`,
  price: 80,
}, {
  type: PointType.FLIGHT,
  title: `Choose seats`,
  price: 5,
}, {
  type: PointType.FLIGHT,
  title: `Travel by train`,
  price: 40,
}];

// случайный элемент массива
const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

// случайное число из диапазона
const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

// получение списка рандомных offers в количестве от 1 до длины массива
export const getRandomOffers = (offers) => {
  const countOffers = getRandomIntegerNumber(1, offers.length);
  const randomOffers = [];
  for (let i = 0; i < countOffers; i++) {
    randomOffers.push(getRandomArrayItem(offers));
  }
  return randomOffers;
};

let globalIndex = 0;

const generateTripPoint = () => {

  const type = getRandomArrayItem(POINT_TYPES);
  const offersTypeAll = getTypeOffers(DefaultOffers, type); // Все офферы нужного типа для генерации чекнутых офферов, которые потом будут приходить с сервера
  const timestamp = new Date().getTime();
  const startTimestamp = timestamp + getRandomIntegerNumber(0, 86400000);
  const endTimestamp = startTimestamp + getRandomIntegerNumber(0, 86400000);

  return {
    id: ++globalIndex,
    pointType: type,
    pointCity: getRandomArrayItem(CITIES),
    timestamp,
    startTimestamp,
    endTimestamp,
    price: getRandomIntegerNumber(10, 100),
    pointOffers: offersTypeAll ? getRandomOffers(offersTypeAll) : ``, // чекнутые офферы
    isFavorite: Math.random() > 0.5,
    destination: null
  };
};

const generateTripPoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTripPoint);
};


export {getRandomIntegerNumber, generateTripPoint, generateTripPoints};
