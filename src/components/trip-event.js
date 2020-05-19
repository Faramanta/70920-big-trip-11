import AbstractComponent from "./abstract-component.js";
import {pointTime, pointISOTime, pointDuration} from "../utils/common.js";

// Точка маршрута

// рендер offer'а
const createOffersMarkup = (offers) => {
  return offers
    .map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    })
    .join(`\n`);
};

const createTripPointTemplate = (point) => {

  const {pointType, pointCity, startTimestamp, endTimestamp, price, pointOffers} = point;
  const pointStart = pointTime(startTimestamp); // время старта
  const pointEnd = pointTime(endTimestamp); // время финиша
  const pointISOStart = pointISOTime(startTimestamp);
  const pointISOEnd = pointISOTime(endTimestamp);

  const pointDur = pointDuration(startTimestamp, endTimestamp);

  const isOffersShowing = !!pointOffers; // есть ли выбранные offers
  const offersMarkup = isOffersShowing ? createOffersMarkup(pointOffers) : ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${pointType} to ${pointCity}</h3>
  
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
  constructor(point, offersChecked) {
    super();

    this._point = point;
    this._offersChecked = offersChecked;
  }

  getTemplate() {
    return createTripPointTemplate(this._point, this._offersChecked);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
