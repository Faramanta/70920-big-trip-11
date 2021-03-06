import AbstractComponent from "./abstract-component.js";
import {getPointTime, getPointISOTime, getPointDurationFormat, capitalizeFirstLetter} from "../utils/common.js";
import {OFFERS_SHOWING} from "../const.js";

// рендер offer'а
const createOffersMarkup = (offers) => {
  return offers ? offers.slice(0, OFFERS_SHOWING)
    .map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    })
    .join(`\n`) : ``;
};

const createTripPointTemplate = (point) => {
  const {pointType, pointDestination, startTimestamp, endTimestamp, price, pointOffers} = point;

  const pointTypeName = capitalizeFirstLetter(pointType);
  const pointStart = getPointTime(startTimestamp); // время старта
  const pointEnd = getPointTime(endTimestamp); // время финиша
  const pointISOStart = getPointISOTime(startTimestamp);
  const pointISOEnd = getPointISOTime(endTimestamp);

  const pointDur = getPointDurationFormat(startTimestamp, endTimestamp);

  const isOffersShowing = !!pointOffers; // есть ли выбранные offers
  const offersMarkup = isOffersShowing ? createOffersMarkup(pointOffers) : ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${pointTypeName} to ${pointDestination.name}</h3>
  
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${pointISOStart}">${pointStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${pointISOEnd}">${pointEnd}</time>
          </p>
          <p class="event__duration">${pointDur}</p>
        </div>
  
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        
${isOffersShowing ?
      `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
    ${offersMarkup}
    </ul>`
      : ``}
  
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Point extends AbstractComponent {
  constructor(point) {
    super();

    this._point = point;
  }

  getTemplate() {
    return createTripPointTemplate(this._point);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
