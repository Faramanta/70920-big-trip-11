import AbstractComponent from "./abstract-component.js";
import {SortType} from "../const.js";

// сортировка
const createSortTemplate = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">
      
      Day
      </span>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="${SortType.DEFAULT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.DEFAULT}" checked>
        <label class="trip-sort__btn" for="${SortType.DEFAULT}">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="${SortType.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.TIME}">
        <label class="trip-sort__btn" for="${SortType.TIME}">
          Time
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="${SortType.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.PRICE}">
        <label class="trip-sort__btn" for="${SortType.PRICE}">
          Price
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  reset() {
    this._currentSortType = SortType.DEFAULT;
    this.getElement().reset();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const sortType = evt.target.getAttribute(`id`);

      if (this._currentSortType === sortType) {
        return;
      }

      this._setSortFieldName(sortType);

      this._currentSortType = sortType;
      handler(this._currentSortType);
    });
  }


  _setSortFieldName(sortType) {
    const sortChangedField = this.getElement().querySelector(`.trip-sort__item--day`);
    if (sortType !== SortType.DEFAULT) {
      sortChangedField.textContent = ``;
    } else {
      sortChangedField.textContent = `Day`;
    }
  }
}
