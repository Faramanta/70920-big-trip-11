import AbstractSmartComponent from "./abstract-smart-component.js";
import {POINT_TYPES_ACTIVITY, POINT_TYPES_TRANSPORT} from "../const.js";
import {capitalizeFirstLetter, getTypeOffers} from "../utils/common.js";
import flatpickr from "flatpickr";
import {encode} from "he";
import "flatpickr/dist/flatpickr.min.css";

const createPointTypesMarkup = (pointTypes, id) => {
  return pointTypes
    .map((pointType) => {

      const pointTypeValue = pointType.toLowerCase();

      return (
        `<div class="event__type-item">
          <input
            id="event-type-${pointTypeValue}-${id}"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${pointType}">
          <label
            class="event__type-label  event__type-label--${pointTypeValue}"
            for="event-type-${pointTypeValue}-${id}">
              ${pointType}
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

// список городов в форме редактирования
const createCityMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      return (
        `<option value="${destination.name}"></option>`
      );
    })
    .join(`\n`);
};

// список фото в форме редактирования
const createPhotosMarkup = (photos) => {
  return photos
    .map((photo) => {
      return (
        `<img class="event__photo" src="${photo.src}" alt="Event photo">`
      );
    })
    .join(`\n`);
};

// destinations в форме редактирования
const createDestinationMarkup = (pointDestination) => {
  return (
    `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${pointDestination.description ? pointDestination.description : ``}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${createPhotosMarkup(pointDestination.pictures)}
      </div>
    </div>
  </section>`
  );
};

// полученные офферы, сравниваем всеь список офферов типа с офферами точки маршрута, совпавшие - чекнутые
const createOffersSelectorMarkup = (offersTypeAllOnly, pointOffers, id) => {
  return offersTypeAllOnly
    .map((offerTypeAllOnly) => {

      const isOfferExist = pointOffers.some((pointOffer) => (offerTypeAllOnly.title === pointOffer.title) || (offerTypeAllOnly.price === pointOffer.price));

      const isChecked = isOfferExist ? true : ``;

      return (
        `<div class="event__offer-selector">
          <input 
            class="event__offer-checkbox  visually-hidden" 
            id="event-offer-${offerTypeAllOnly.title}-${offerTypeAllOnly.price}-${id}" 
            type="checkbox" 
            name="event-offer-${offerTypeAllOnly}"
            ${isChecked ? `checked` : ``} 
            />
          <label 
            class="event__offer-label" 
            for="event-offer-${offerTypeAllOnly.title}-${offerTypeAllOnly.price}-${id}"
          >
            <span class="event__offer-title">${offerTypeAllOnly.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerTypeAllOnly.price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const createTripPointEditTemplate = (point, pointType, offers, destinations) => {
  const {id, pointCity: notSanitizedCity, pointDestination, price, isFavorite, pointOffers} = point;

  const offersTypeAll = getTypeOffers(offers, pointType);
  const offersTypeAllOnly = [];
  offersTypeAll.map((offerTypeAll) => offersTypeAllOnly.push(...offerTypeAll.offers));

  const pointCity = encode(notSanitizedCity);
  const pointTypeName = capitalizeFirstLetter(pointType);

  const pointTypesTransferMarkup = createPointTypesMarkup(POINT_TYPES_TRANSPORT.slice(), id);
  const pointTypesActivityMarkup = createPointTypesMarkup(POINT_TYPES_ACTIVITY.slice(), id);
  const pointCityMarkup = createCityMarkup(destinations);
  const isOffersShowing = offersTypeAll.length > 0; // есть лиs offers
  const offersSelectorMarkup = isOffersShowing ? createOffersSelectorMarkup(offersTypeAllOnly, pointOffers, id) : ``;
  const destinationMarkup = pointDestination ? createDestinationMarkup(pointDestination) : ``;

  return (
    `<li class="trip-events__item">
      <form class="trip-events__item event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
  
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                
                ${pointTypesTransferMarkup}
                
              </fieldset>
  
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                
                ${pointTypesActivityMarkup}
                
              </fieldset>
            </div>
          </div>
  
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${pointTypeName} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${pointCity}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${pointCityMarkup}
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
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
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
  ${isOffersShowing || pointDestination ?
      `<section class="event__details">` : ``}
        ${isOffersShowing ?
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          
          ${offersSelectorMarkup}
           
      </div>
    </section>` : ``}
    
    ${pointDestination ?
      `${destinationMarkup}` : ``}
     ${isOffersShowing && pointDestination ? `</section>` : ``}
    </form>
  </li>`
  );
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point, offers, destination) {
    super();
    this._point = point;
    this._offers = offers;
    this._destination = destination;

    this._pointType = this._point.pointType;

    this._isFormDirty = false;

    this._startFlatpickr = null;
    this._endFlatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._inputDestination = null;
    this._form = null;
    this._applyFlatpickr();
    this._subscribeOnEvents(offers);
    this._initFormValidation();
  }

  get isFormValid() {
    return this._form.checkValidity();
  }

  getData() {
    return new FormData(this._form);
  }


  getTemplate() {
    return createTripPointEditTemplate(this._point, this._pointType, this._offers, this._destination);
  }

  removeElement() {
    this._destroyFlatpickr();

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoritesButtonClickHandler(this._favoriteButtonClickHandler);
    this._subscribeOnEvents();
    this._initFormValidation();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    this._pointType = this._point.pointType;

    this.rerender();
  }

  destroy() {
    this._destroyFlatpickr();
  }

  _applyFlatpickr() {
    this._destroyFlatpickr();

    const pointStart = this.getElement().querySelector(`#event-start-time-1`);
    const pointEnd = this.getElement().querySelector(`#event-end-time-1`);

    this._startFlatpickr = this._createFlatpickr(pointStart, this._point.startTimestamp);

    this._endFlatpickr = this._createFlatpickr(pointEnd, this._point.endTimestamp);
  }

  _createFlatpickr(inputField, date) {
    return flatpickr(inputField, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: date || ``,
    });
  }

  _destroyFlatpickr() {
    if (this._startFlatpickr) {
      this._startFlatpickr.destroy();
      this._startFlatpickr = null;
    }
    if (this._endFlatpickr) {
      this._endFlatpickr.destroy();
      this._endFlatpickr = null;
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const selectTypesList = element.querySelector(`.event__type-list`);

    if (selectTypesList) {
      selectTypesList.addEventListener(`change`, (evt) => {

        this._pointType = evt.target.value.toLowerCase();

        this.rerender();
      });
    }
  }

  _initFormValidation() {
    this._form = this.getElement().querySelector(`form`);
    this._inputDestination = this._form.querySelector(`.event__input--destination`);

    this._inputDestination.addEventListener(`input`, (_evt) => {
      if (this._isFormDirty) {
        this._validatedDestination();
      }
    });
  }

  _validateForm() {
    this._validatedDestination(this._inputDestination);
    this._form.reportValidity();
  }

  _validatedDestination() {
    let inputText = this._inputDestination.value;

    if (inputText) {
      inputText = `${inputText.charAt(0).toUpperCase()}${inputText.slice(1)}`;
    }

    const cities = [];
    this._destination.map((item) => cities.push(item.name));

    const city = cities.includes(inputText);

    if (city) {
      this._inputDestination.value = inputText;
      this._inputDestination.setCustomValidity(``);
      this._inputDestination.style.backgroundColor = `transparent`;
    } else {
      this._inputDestination.setCustomValidity(`Выберите значение из списка`);
      this._inputDestination.style.backgroundColor = `rgba(255, 0, 0, .5)`;
    }
  }

  setSubmitHandler(handler) {
    if (!this._submitHandler) {
      this._submitHandler = (evt) => {
        evt.preventDefault();
        this._isFormDirty = true;
        this._validateForm();
        handler(evt);
      };
    }

    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, this._submitHandler);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    if (!this._deleteButtonClickHandler) {
      this._deleteButtonClickHandler = handler;
    }
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, handler);

    if (!this._favoriteButtonClickHandler) {
      this._favoriteButtonClickHandler = handler;
    }
  }
}
