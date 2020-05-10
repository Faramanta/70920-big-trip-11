import AbstractComponent from "./abstract-component.js";

// Список дней
const createTripDayListTemplate = () => `<ul class="trip-days"></ul>`;

export default class Days extends AbstractComponent {
  getTemplate() {
    return createTripDayListTemplate();
  }
}
