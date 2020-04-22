import {createElement} from "../utils.js";

// контейнер для маршрута и стоимости
const createTripInformationTemplate = () => `<section class="trip-main__trip-info  trip-info"></section>`;

export default class Trip {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripInformationTemplate();
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
