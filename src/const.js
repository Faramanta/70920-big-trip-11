export const EVENT_COUNT = 10;

export const EventType = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
  CHECKIN: `Check-in`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`,
};

export const EVENT_TYPES = [
  EventType.TAXI,
  EventType.BUS,
  EventType.TRAIN,
  EventType.SHIP,
  EventType.TRANSPORT,
  EventType.DRIVE,
  EventType.FLIGHT,
  EventType.CHECKIN,
  EventType.SIGHTSEEING,
  EventType.RESTAURANT,
];

export const CITIES = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`
];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const FILTER_TYPES = [
  FilterType.EVERYTHING,
  FilterType.FUTURE,
  FilterType.PAST
];

export const MONTHS = [
  `Jan`,
  `Feb`,
  `Mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sep`,
  `Oct`,
  `Nov`,
  `Dec`,
];

export const ONE_MINUTE = 1000 * 60;
export const ONE_HOUR = ONE_MINUTE * 60; // 1000 * 60 * 60
export const ONE_DAY = ONE_HOUR * 24; // 1000 * 60 * 60 * 24

export const KeyCode = {
  ESC: `Esc`,
  ESCAPE: `Escape`
};

export const SortType = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit,`
};
