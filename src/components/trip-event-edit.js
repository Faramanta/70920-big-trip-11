import AbstractComponent from "./abstract-components";
import {EVENT_TYPES, CITIES} from "../const.js";

// Форма создания/редактирования
const createEventTypesMarkup = (eventTypes) => {
  return eventTypes
    .map((eventType) => {

      const eventTypeValue = eventType.toLowerCase();

      return (
        `<div class="event__type-item">
          <input
            id="event-type-${eventTypeValue}-1"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${eventTypeValue}">
          <label
            class="event__type-label  event__type-label--${eventTypeValue}"
            for="event-type-${eventTypeValue}-1">
              ${eventType}
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

// список городов в форме редактирования
const createCityMarkup = (cities) => {
  return cities
    .map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    })
    .join(`\n`);
};

// полученные офферы, сравниваем всеь список офферов типа с офферами точки маршрута, совпавшие - чекнутые
const createOffersSelectorMarkup = (offersTypeAll, eventOffers) => {

  return offersTypeAll
    .map((offerTypeAll) => {

      const isOfferExist = eventOffers.some((offer) => offerTypeAll === offer);

      const isChecked = isOfferExist ? true : ``;

      return (
        `<div class="event__offer-selector">
          <input 
            class="event__offer-checkbox  visually-hidden" 
            id="event-offer-${offerTypeAll.type}-1" 
            type="checkbox" 
            name="event-offer-${offerTypeAll.type}"
            ${isChecked ? `checked` : ``} 
            />
          <label 
            class="event__offer-label" 
            for="event-offer-${offerTypeAll.type}-1"
          >
            <span class="event__offer-title">${offerTypeAll.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerTypeAll.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const createTripEventEditTemplate = (event, offersTypeAll, cities) => {
  const {eventType, eventCity, eventOffers} = event;

  const eventTypesTransferMarkup = createEventTypesMarkup(EVENT_TYPES.slice(0, 7));
  const eventTypesActivityMarkup = createEventTypesMarkup(EVENT_TYPES.slice(7, 10));
  const eventCityMarkup = createCityMarkup(cities);
  const isOffersShowing = offersTypeAll.length > 0; // есть лиs offers
  const offersSelectorMarkup = isOffersShowing ? createOffersSelectorMarkup(offersTypeAll, eventOffers) : ``;

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
  
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                
                ${eventTypesTransferMarkup}
                
              </fieldset>
  
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                
                ${eventTypesActivityMarkup}
                
              </fieldset>
            </div>
          </div>
  
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventType} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${eventCity}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${eventCityMarkup}
            </datalist>
          </div>
  
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
          </div>
  
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
          </div>
  
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
  
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
  
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
  
  ${isOffersShowing ?
      `<section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
            <div class="event__available-offers">
            
             ${offersSelectorMarkup}
             
            </div>
          </section>
        </section>`
      : ``
    }
      </form>
    </li>`
  );
};

export default class EventEdit extends AbstractComponent {
  constructor(event, eventOffers, cities) {
    super();

    this._event = event;
    this._eventOffers = eventOffers;
    this._cities = cities;
  }

  getTemplate() {
    return createTripEventEditTemplate(this._event, this._eventOffers, this._cities);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);
  }
}
