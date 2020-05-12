import {FILTER_TYPES} from "../const.js";
import AbstractComponent from "./abstract-component.js";

const createFiltersMarkup = (filterTypes) => {
  return filterTypes
    .map((filterType) => {

      return (
        `<div class="trip-filters__filter">
          <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType}" >
          <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType}</label>
        </div>`
      );
    })
    .join(`\n`);
};

// фильтры
const createFiltersTemplate = () => {
  const filterMarkup = createFiltersMarkup(FILTER_TYPES);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterType = evt.target.value;
      handler(filterType);
    });
  }
}
