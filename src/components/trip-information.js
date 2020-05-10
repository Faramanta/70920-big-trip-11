import AbstractComponent from "./abstract-component.js";

// контейнер для маршрута и стоимости
const createTripInformationTemplate = () => `<section class="trip-main__trip-info  trip-info"></section>`;

export default class Trip extends AbstractComponent {
  getTemplate() {
    return createTripInformationTemplate();
  }
}
