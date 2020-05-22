export const POINT_COUNT = 5;

export const HIDDEN_CLASS = `visually-hidden`;

export const PointType = {
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

export const POINT_TYPES = [
  PointType.TAXI,
  PointType.BUS,
  PointType.TRAIN,
  PointType.SHIP,
  PointType.TRANSPORT,
  PointType.DRIVE,
  PointType.FLIGHT,
  PointType.CHECKIN,
  PointType.SIGHTSEEING,
  PointType.RESTAURANT,
];
export const POINT_TYPES_TRANSPORT = [
  PointType.TAXI,
  PointType.BUS,
  PointType.TRAIN,
  PointType.SHIP,
  PointType.TRANSPORT,
  PointType.DRIVE,
  PointType.FLIGHT,
];
export const POINT_TYPES_ACTIVITY = [
  PointType.CHECKIN,
  PointType.SIGHTSEEING,
  PointType.RESTAURANT,
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

export const ONE_SECOND = 1000;
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
  EDIT: `edit`,
  ADDING: `adding`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
};

export const ChartTitle = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPEND: `TIME SPEND`
};

export const typeIcons = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🛳`,
  'transport': `🚊`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛️`,
  'restaurant': `🍴`
};

export const chartOptions = {
  'type': `horizontalBar`,
  'datasetsBackgroundColor': `#ffffff`,
  'datasetsHoverBackgroundColor': `#ffffff`,
  'datasetsAnchor': `start`,
  'datalabelsFontSize': 13,
  'datalabelsColor': `#000000`,
  'datalabelAnchor': `end`,
  'datalabelAlign': `start`,
  'titleFontColor': `#000000`,
  'titleFontSize': 23,
  'titlePosition': `left`,
  'ticksFontColor': `#000000`,
  'ticksPadding': 5,
  'ticksFontSize': 13,
  'barThickness': 44,
  'minBarLength': 50,
};

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

export const OFFERS_IF_PREFIX = `event-offer-`;
