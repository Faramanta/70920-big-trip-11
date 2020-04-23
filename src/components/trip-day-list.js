import {createElement} from "../utils.js";

// Список дней
const createTripDayListTemplate = () => `<ul class="trip-days"></ul>`;

export default class Days {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDayListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

