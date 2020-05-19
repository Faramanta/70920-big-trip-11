import SortComponent from "../components/sort.js";
import DaysComponent from "../components/trip-day-list.js";
import DayComponent from "../components/trip-day-item.js";
import PointsComponent from "../components/trip-event-list.js";
import NoPointsComponent from "../components/no-events.js";
import PointController from "../controllers/point.js";
import {render, RenderPosition} from "../utils/render.js";
import {getPreparedPoints, getSortedPoints} from "../utils/common.js";
import {SortType, HIDDEN_CLASS} from "../const.js";

import {Mode} from "../const.js";

const renderDay = (siteTripDayListElement, points, offers, cities, onDataChange, onViewChange, onFavoriteChange, index = null, timestamp = null) => { // один день маршрута

  const siteTripDayElement = new DayComponent(timestamp, index);

  render(siteTripDayListElement.getElement(), siteTripDayElement, RenderPosition.BEFOREEND); // отрисовка trip-days__item

  const siteTripPointListElement = new PointsComponent();

  render(siteTripDayElement.getElement(), siteTripPointListElement, RenderPosition.BEFOREEND); // отрисовка trip-events__list

  return points.map((point) => {

    const pointController = new PointController(siteTripPointListElement.getElement(), onDataChange, onViewChange, onFavoriteChange);

    pointController.render(point, offers, cities, Mode.DEFAULT);

    return pointController;

  });
};

const renderDays = (place, pointsGroups, offers, cities, onDataChange, onViewChange, onFavoriteChange) => {

  const controllers = [];

  Array.from(pointsGroups.entries()).forEach((pointsGroup, index) => {
    const [timestamp, points] = pointsGroup;
    const pointControllers = renderDay(place, points, offers, cities, onDataChange, onViewChange, onFavoriteChange, index, timestamp);

    controllers.push(...pointControllers);
  });

  return controllers;
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._sortType = SortType.DEFAULT;
    this._createController = null;

    this._newPointBtn = document.querySelector(`.trip-main__event-add-btn`);

    this._pointControllers = [];
    this._pointsComponent = new PointsComponent();
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = new DaysComponent();

    this._onViewChange = this._onViewChange.bind(this);
    this._setDefaultViewControllers = this._setDefaultViewControllers.bind(this);
    this._onCloseCreateForm = this._onCloseCreateForm.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this.renderContent = this.renderContent.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterTypeChange);

    this.addNewPointBtnClickHandler();
  }

  render(offers, cities) {
    const points = this._pointsModel.getPoints();
    this._offers = offers;
    this._cities = cities;

    if (points.size === 0) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND); // отрисовка сообщения оо отсутствии точек
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.AFTERBEGIN); // отрисовка сортировки
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND); // отрисовка контейнера .trip-days

    this.renderContent();
  }


  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  createNewPoint() {
    if (this._createController) {
      return;
    }

    const place = document.querySelector(`.trip-days`);

    this._createController = new PointController(place, this._onDataChange, this._onViewChange, this._onFavoriteChange, this._onCloseCreateForm);
    this._createController.render(null, this._offers, this._cities, Mode.ADDING);
  }

  _onViewChange() {
    this._setDefaultViewControllers();
    this._destroyCreateController();
  }

  _setDefaultViewControllers() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onFavoriteChange(pointController, oldData, newData) {
    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

    if (isSuccess) {
      pointController.render(newData, this._offers, this._cities, Mode.EDIT);
    }
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData.id === -1) {

      this._pointsModel.addPoint(newData);
      this._destroyCreateController();
      this.renderContent();

    } else if (newData === null) {
      const isSuccess = this._pointsModel.removePoint(oldData.id);
      if (isSuccess) {
        pointController.destroy();
      }
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        this.renderContent();
      }
    }
  }

  _onCloseCreateForm() {
    this._destroyCreateController();
    this._newPointBtn.disabled = false;
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    this.renderContent();
  }

  _onFilterTypeChange() {
    this._resetSortType();
    this.renderContent();
  }

  _resetSortType() {
    this._sortType = SortType.DEFAULT;
    this._sortComponent.reset();
  }

  _destroyCreateController() {
    if (this._createController !== null) {
      this._createController.destroy();
      this._createController = null;
    }
    this._newPointBtn.disabled = false;
  }

  _destroy() {
    this._pointControllers.forEach((controller) => {
      controller.destroy();
      controller = null;
    });

    this._pointControllers = [];

    const daysListElement = this._daysComponent.getElement(); // .trip-days
    daysListElement.innerHTML = ``;
  }

  renderContent() {
    this._destroy();
    if (this._sortType === SortType.DEFAULT) {
      const groupedPoints = getPreparedPoints(this._pointsModel.getPoints(), this._sortType);
      this._pointControllers = renderDays(this._daysComponent, groupedPoints, this._offers, this._cities, this._onDataChange, this._onViewChange, this._onFavoriteChange);

      return;
    }

    const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), this._sortType);
    this._pointControllers = renderDay(this._daysComponent, sortedPoints, this._offers, this._cities, this._onDataChange, this._onViewChange, this._onFavoriteChange);
  }

  addNewPointBtnClickHandler() {
    this._newPointBtn.addEventListener(`click`, () => {
      this._newPointBtn.disabled = true;
      this.createNewPoint();
      this._setDefaultViewControllers();
    });
  }
}
