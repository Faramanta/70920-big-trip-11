import AbstractSmartComponent from "./abstract-smart-component.js";
import {POINT_TYPES_ACTIVITY, POINT_TYPES_TRANSPORT, Mode} from "../const.js";
import {capitalizeFirstLetter, getTypeOffers, pointTime, getOfferUID} from "../utils/common.js";
import flatpickr from "flatpickr";
import {encode} from "he";
// import he from 'he';
import "flatpickr/dist/flatpickr.min.css";

const createPointTypesMarkup = (pointTypes, id, type) => {

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
            value="${pointTypeValue}"
            ${(type === pointTypeValue) ? `checked` : ``}
            >
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

      const isOfferExist = pointOffers.some((offer) => (offerTypeAllOnly.title === offer.title) || (offerTypeAllOnly.price === offer.price));

      const isChecked = isOfferExist ? true : ``;

      const offerUID = getOfferUID(offerTypeAllOnly.title, offerTypeAllOnly.price, id);

      return (
        `<div class="event__offer-selector">
          <input 
            class="event__offer-checkbox  visually-hidden" 
            id="${offerUID}" 
            value="${offerUID}" 
            type="checkbox" 
            name="event-offer"
            ${isChecked ? `checked` : ``} 
            />
          <label 
            class="event__offer-label" 
            for="${offerUID}"
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

// отрисовка кнопок в зависимости от mode
const createButtonsMarkup = (mode, id, isFavorite) => {
  return mode !== Mode.ADDING ? (
    `<button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-${id}" value="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-${id}">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>
      <button class="event__rollup-btn" type="button">`) : (`<button class="event__reset-btn" type="reset">Cansel</button>`);
};

const createTripPointEditTemplate = (point, pointType, pointDestination, offers, destinations, mode) => {
  const {id, price: notSanitizedPrice, isFavorite, pointOffers, startTimestamp, endTimestamp} = point;

  const price = encode(notSanitizedPrice.toString());

  // if (pointDestination) {
  //   const cityDisplayText = he.encode(pointDestination.name);
  // }

  const pointDestinationFromServer = destinations.find((destination) => destination.name === pointDestination.name);

  const offersTypeAll = getTypeOffers(offers, pointType); // все офферы типа

  const pointTypeName = capitalizeFirstLetter(pointType);
  const pointStart = pointTime(startTimestamp); // время старта
  const pointEnd = pointTime(endTimestamp); // время финиша
  const pointTypesTransferMarkup = createPointTypesMarkup(POINT_TYPES_TRANSPORT.slice(), id, pointType);
  const pointTypesActivityMarkup = createPointTypesMarkup(POINT_TYPES_ACTIVITY.slice(), id, pointType);
  const pointCityMarkup = createCityMarkup(destinations);
  const isOffersShowing = offersTypeAll.length > 0; // есть лиs offers
  const offersSelectorMarkup = isOffersShowing ? createOffersSelectorMarkup(offersTypeAll, pointOffers, id) : ``;
  const destinationMarkup = pointDestination ? createDestinationMarkup(pointDestinationFromServer) : ``;
  const buttonsMarkup = createButtonsMarkup(mode, id, isFavorite);

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
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${pointDestination ? pointDestination.name : ``}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${pointCityMarkup}
            </datalist>
          </div>
  
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${pointStart}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${pointEnd}">
          </div>
  
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="number" min="0" name="event-price" value="${price}">
          </div>
  
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          ${buttonsMarkup}
 
          
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
  constructor(point, offers, destinations, mode) {
    super();
    this._point = point;
    this._offers = offers;
    this._destinations = destinations;
    this._mode = mode;

    this._pointDestination = this._point.pointDestination;
    this._pointType = this._point.pointType;

    this._isFormDirty = false;
    this._isWaiting = false;

    this._startFlatpickr = null;
    this._endFlatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._canselButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._inputDestination = null;
    this._inputDateStart = null;
    this._inputDateEnd = null;
    this._inputPrice = null;
    this._form = null;
    this._applyFlatpickr();
    this._subscribeOnEvents(offers);
    this._initFormValidation();
  }

  getData() {
    return new FormData(this._form);
  }

  getTemplate() {
    return createTripPointEditTemplate(this._point, this._pointType, this._pointDestination, this._offers, this._destinations, this._mode);
  }

  removeElement() {
    this._destroyFlatpickr();

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setCanselButtonClickHandler(this._canselButtonClickHandler);
    if (this._favoriteButtonClickHandler) {
      this.setFavoritesButtonClickHandler(this._favoriteButtonClickHandler);
    }
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
      altInput: true,
      allowInput: true,
      enableTime: true,
      altFormat: `d/m/y H:i`,
      dateFormat: `U`,
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

      const selectedDestination = this._getSelectedDestination();

      if (this._isFormDirty) {
        this._validatedDestination(selectedDestination);
      }

      if (selectedDestination) {
        this._pointDestination = selectedDestination;
        this._inputDestination.value = selectedDestination.name;

        this.rerender();
      }
    });

    this._inputDateStart = this._form.querySelector(`#event-start-time-1`);
    this._inputDateEnd = this._form.querySelector(`#event-end-time-1`);

    this._inputDateStart.addEventListener(`input`, (_evt) => {
      if (this._isFormDirty) {
        this._validateDateInputs(this._inputDateStart, this._inputDateEnd);
      }
    });

    this._inputDateEnd.addEventListener(`input`, (_evt) => {
      if (this._isFormDirty) {
        this._validateDateInputs(this._inputDateStart, this._inputDateEnd);
      }
    });
  }

  _validateForm() {
    const selectedDestination = this._getSelectedDestination();

    // валидация города
    this._validatedDestination(selectedDestination);

    // валидация дат начала и окончания
    this._validateDateInputs();

    // валидация цены
    this._inputPrice = this._form.querySelector(`.event__input--price`);
    const inputPriceValue = this._inputPrice.value;
    this._validatePrice(inputPriceValue);

    this._form.reportValidity();
  }

  _getSelectedDestination() {
    let inputText = this._inputDestination.value;

    if (inputText) {
      inputText = `${inputText.charAt(0).toUpperCase()}${inputText.slice(1)}`;
    }

    return this._destinations.find((item) => item.name === inputText);
  }

  _validatedDestination(selectedDestination) {
    if (selectedDestination) {
      this._inputDestination.setCustomValidity(``);
      this._inputDestination.style.backgroundColor = `transparent`;
    } else {
      this._inputDestination.setCustomValidity(`Выберите значение из списка`);
      this._inputDestination.style.backgroundColor = `rgba(255, 0, 0, .5)`;
    }
  }

  _validateDateInputs() {
    const inputDateStartValue = this._inputDateStart.value;
    const inputDateEndValue = this._inputDateEnd.value;
    const inputs = this._form.querySelectorAll(`.event__input--time`);

    inputs.forEach(
        (input) => {
          if (inputDateStartValue < inputDateEndValue) {
            input.setCustomValidity(``);
            input.style.backgroundColor = `transparent`;
          } else {
            input.setCustomValidity(`Дата начала должна быть меньше даты окончания`);
            input.style.backgroundColor = `rgba(255, 0, 0, .5)`;
          }
        }
    );
  }

  _validatePrice(inputPriceValue) {
    if (inputPriceValue > -1) {
      this._inputPrice.setCustomValidity(``);
      this._inputPrice.style.backgroundColor = `transparent`;
    } else {
      this._inputPrice.setCustomValidity(`Цена должна быть больше 0`);
      this._inputPrice.style.backgroundColor = `rgba(255, 0, 0, .5)`;
    }
  }

  setSubmitHandler(handler) {
    if (!this._submitHandler) {
      this._submitHandler = (evt) => {
        evt.preventDefault();

        this._isFormDirty = true;

        this._validateForm();

        if (this._form.checkValidity()) {
          handler(evt);
        }
      };
    }

    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, this._submitHandler);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (!this._deleteButtonClickHandler) {
          this._deleteButtonClickHandler = handler(evt);
        }
      });
  }

  setCanselButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    if (!this._canselButtonClickHandler) {
      this._canselButtonClickHandler = handler;
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
