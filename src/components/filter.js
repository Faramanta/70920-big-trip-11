import {FILTERS} from "../const.js";
import AbstractComponent from "./abstract-component.js";

const createFiltersMarkup = (filters) => {
  return filters
    .map((filter) => {
      return (
        `<div class="trip-filters__filter">
          <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" checked>
          <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
        </div>`
      );
    })
    .join(`\n`);
};

// фильтры
const createFiltersTemplate = () => {
  const filterMarkup = createFiltersMarkup(FILTERS);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractComponent {
  getTemplate() {
    return createFiltersTemplate();
  }
}
