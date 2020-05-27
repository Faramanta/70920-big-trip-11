import AbstractComponent from "./abstract-component.js";
import {MenuItem} from "../const.js";

// меню
const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" data-menu-item="${MenuItem.STATS}" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    items.forEach((item) => {
      item.classList.remove(`trip-tabs__btn--active`);
      return item.textContent === menuItem ? item.classList.add(`trip-tabs__btn--active`) : item.classList.remove(`trip-tabs__btn--active`);
    });
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.dataset.menuItem;

      handler(menuItem);
    });
  }

}
