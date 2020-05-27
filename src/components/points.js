import AbstractComponent from "./abstract-component.js";

// Список точек маршрута
const createTripPointsListTemplate = () => `<ul class="trip-events__list"></ul>`;

export default class Points extends AbstractComponent {
  getTemplate() {
    return createTripPointsListTemplate();
  }
}
