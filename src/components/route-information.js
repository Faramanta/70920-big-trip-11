import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from "moment";

const createTitle = (points) => {
  if (points.length === 0) {
    return ``;
  }

  const titles = points.map((point) => point.pointDestination.name);

  if (points.length === 1) {
    return titles;
  }

  const firstCity = titles[0];
  const lastCity = titles[titles.length - 1];

  if (points.length <= 3) {
    return titles.join(` &mdash; `);
  }

  return `${firstCity} &mdash; ... &mdash;${lastCity}`;
};

const createDates = (points) => {
  if (points.length === 0) {
    return ``;
  }

  const firstPoint = points[1];
  const lastPoint = points[points.length - 1];

  const startDate = moment(firstPoint.startTimestamp).format(`MMMM D`);
  const endDate = moment(lastPoint.endTimestamp).format(`MMMM D`);

  return `${startDate} &mdash; ${endDate}`;
};

const createTotalCost = (points) => {
  if (points.length === 0) {
    return 0;
  }

  return points.reduce((pointsTotalPrice, point) => {
    if (point.pointOffers.length === 0) {
      pointsTotalPrice += point.price;
      return pointsTotalPrice;
    }

    const pointOffersPrice = point.pointOffers.reduce((offersPrice, offer) => {
      offersPrice += offer.price;
      return offersPrice;
    }, 0);


    pointsTotalPrice += point.price + pointOffersPrice;

    return pointsTotalPrice;
  }, 0);
};

// маршрут
const createRouteInformationTemplate = (points) => {

  const title = createTitle(points);
  const dates = createDates(points);
  const cost = createTotalCost(points);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${dates}</p>
    </div>
    <p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span></p>`
  );
};

export default class Route extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;
    this._rerender = this._rerender.bind(this);
    this._pointsModel.setDataChangeHandler(this._rerender);

  }

  getTemplate() {
    const points = this._pointsModel.getPoints();
    return createRouteInformationTemplate(points);
  }

  recoveryListeners() {}


  _rerender() {
    super.rerender();
  }
}
