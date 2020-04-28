import AbstractComponent from "./abstract-components";

// Список точек маршрута
const createTripEventsListTemplate = () => `<ul class="trip-events__list"></ul>`;

export default class Events extends AbstractComponent {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
