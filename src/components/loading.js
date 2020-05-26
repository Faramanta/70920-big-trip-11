import AbstractComponent from "./abstract-component.js";

const createLoadingTemplate = () => `<p class="trip-events__msg">Loading...</p>`;

export default class Loading extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
