import {EVENT_TYPES} from "../const.js";
import {CITY} from "../const.js";

const DefaultOffers = [{
  type: `meal`,
  title: `Add meal`,
  price: `50`,
}, {
  type: `breakfast`,
  title: `Add breakfast`,
  price: `50`,
}, {
  type: `luggage`,
  title: `Add luggage`,
  price: `50`,
}, {
  type: `tickets`,
  title: `Book tickets`,
  price: `40`,
}, {
  type: `lunch`,
  title: `Lunch in city`,
  price: `30`,
}, {
  type: `taxi`,
  title: `Order Uber`,
  price: `20`,
}, {
  type: `car`,
  title: `Rent a car`,
  price: `200`,
}, {
  type: `comfort`,
  title: `Switch to comfort`,
  price: `80`,
}, {
  type: `seats`,
  title: `Choose seats`,
  price: `5`,
}, {
  type: `train`,
  title: `Travel by train`,
  price: `40`,
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

// получение списка рандомных offers в количестве от 1 до 5
const getRandomOffers = (offers) => {
  const countOffers = getRandomIntegerNumber(1, 5);
  const randomOffers = [];
  for (let i = 0; i < countOffers; i++) {
    randomOffers.push(getRandomArrayItem(offers));
  }
  return randomOffers;
};

const generateTripEvent = () => {
  const offers = Math.random() > 0.5 ? null : true;

  return {
    eventType: getRandomArrayItem(EVENT_TYPES),
    eventCity: getRandomArrayItem(CITY),
    timestamp: new Date().getTime(),
    offers,
    randomOffers: offers ? getRandomOffers(DefaultOffers) : `` // рандомно выбранный offer
  };
};

const generateTripEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTripEvent);
};

export {getRandomIntegerNumber, getRandomOffers, generateTripEvent, generateTripEvents};
