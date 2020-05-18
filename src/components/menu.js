import AbstractComponent from "./abstract-component.js";
import {MenuItem} from "../const.js";

// меню
const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-type="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" data-menu-type="${MenuItem.STATS}" href="#">Stats</a>
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

  // setActiveMenuItem(menuItem) {
  //   const activeClass = `trip-tabs__btn--active`;
  //   const itemMenu = this.getElement().querySelector(`.trip-tabs__btn`);
  //
  //   const itemsMenu = Array.from(this.getElement().querySelector(`.trip-tabs__btn`));
  //   itemsMenu.forEach((tab) => tab.classList.remove(activeClass));
  //
  //   if (itemMenu) {
  //     itemMenu.classList.add(activeClass);
  //   }
  // }
  //
  //
}


