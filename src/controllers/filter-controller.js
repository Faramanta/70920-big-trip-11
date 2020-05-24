import FilterComponent from "../components/filter.js";
import {FilterType, MenuItem} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._filterComponent = null;
    this._activeFilterType = FilterType.EVERYTHING;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterTypeChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    this._activeFilterType = FilterType.EVERYTHING;
    this.render();
  }

  setActiveView(menuItem) {
    return menuItem === MenuItem.STATS ? this._filterComponent.setDisableInputs() : this._filterComponent.setEnableInputs();
  }

  _onFilterTypeChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
