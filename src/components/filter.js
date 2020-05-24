import AbstractComponent from "./abstract-component.js";

const createFiltersMarkup = (filters) => {
  return filters
    .map((filter) => {

      return (
        `<div class="trip-filters__filter">
          <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${filter.checked ? `checked` : ``}>
          <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
        </div>`
      );
    })
    .join(`\n`);
};

// фильтры
const createFiltersTemplate = (filters) => {
  const filterMarkup = createFiltersMarkup(filters);
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

  setDisableInputs() {
    this.getElement().querySelectorAll(`.trip-filters__filter-input`)
      .forEach((input) => input.setAttribute(`disabled`, `disabled`));
  }

  setEnableInputs() {
    this.getElement().querySelectorAll(`.trip-filters__filter-input`)
      .forEach((input) => input.removeAttribute(`disabled`));
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterType = evt.target.value;
      handler(filterType);
    });
  }
}
