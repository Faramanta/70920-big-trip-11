import AbstractSmartComponent from "./abstract-smart-component.js";
import {EVENT_TYPES} from "../const.js";
import {getTypeOffers} from "../mock/trip-event.js";


// Форма создания/редактирования
const createEventTypesMarkup = (eventTypes, id) => {
  return eventTypes
    .map((eventType) => {

      const eventTypeValue = eventType.toLowerCase();

      return (
        `<div class="event__type-item">
          <input
            id="event-type-${eventTypeValue}-${id}"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${eventType}">
          <label
            class="event__type-label  event__type-label--${eventTypeValue}"
            for="event-type-${eventTypeValue}-${id}">
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
const createOffersSelectorMarkup = (offersTypeAll, eventOffers, id) => {
  return offersTypeAll
    .map((offerTypeAll) => {

      const isOfferExist = eventOffers.some((offer) => offerTypeAll === offer);

      const isChecked = isOfferExist ? true : ``;

      return (
        `<div class="event__offer-selector">
          <input 
            class="event__offer-checkbox  visually-hidden" 
            id="event-offer-${offerTypeAll.title}-${offerTypeAll.price}-${id}" 
            type="checkbox" 
            name="event-offer-${offerTypeAll.type}"
            ${isChecked ? `checked` : ``} 
            />
          <label 
            class="event__offer-label" 
            for="event-offer-${offerTypeAll.title}-${offerTypeAll.price}-${id}"
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

const createTripEventEditTemplate = (event, offers, cities) => {
  const {id, eventCity, price, isFavorite, destination, eventType, eventOffers} = event;

  const offersTypeAll = getTypeOffers(offers, eventType);

  const eventTypesTransferMarkup = createEventTypesMarkup(EVENT_TYPES.slice(0, 7), id);
  const eventTypesActivityMarkup = createEventTypesMarkup(EVENT_TYPES.slice(7, 10), id);
  const eventCityMarkup = createCityMarkup(cities);
  const isOffersShowing = offersTypeAll.length > 0; // есть лиs offers
  const offersSelectorMarkup = isOffersShowing ? createOffersSelectorMarkup(offersTypeAll, eventOffers, id) : ``;

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
  
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
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${eventType} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${eventCity}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${eventCityMarkup}
            </datalist>
          </div>
  
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="18/03/19 12:25">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="18/03/19 13:35">
          </div>
  
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
          </div>
  
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
  
          <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-${id}">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
  
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
  ${isOffersShowing || destination ?
      `<section class="event__details">` : ``}
         ${isOffersShowing ?
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
        <div class="event__available-offers">
            
          ${offersSelectorMarkup}
             
        </div>
      </section>` : ``}
          
        ${destination ?
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
              <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
                <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
                <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
                <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
              </div>
            </div>
          </section>` : ``}
        ${isOffersShowing && destination ? `</section>` : ``}
      </form>
    </li>`
  );
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, offers, cities) {
    super();
    this._event = event;
    this._offers = offers;
    this._cities = cities;

    this._event.eventType = event.eventType;
    this._event.isFavorite = event.isFavorite;

    this._submitHandler = null;
    this._subscribeOnEvents(offers);
  }

  getTemplate() {
    return createTripEventEditTemplate(this._event, this._offers, this._cities);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const event = this._event;

    this._event.eventType = event.eventType;
    this._event.isFavorite = event.isFavorite;

    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, handler);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const selectTypesList = element.querySelector(`.event__type-list`);

    if (selectTypesList) {
      selectTypesList.addEventListener(`change`, (evt) => {

        this._event.eventType = evt.target.value;

        this.rerender();
      });
    }
  }
}
