import SortComponent from "../components/sort.js";
import DaysComponent from "../components/trip-day-list.js";
import DayComponent from "../components/trip-day-item.js";
import EventsComponent from "../components/trip-event-list.js";
import NoEventsComponent from "../components/no-events.js";
import PointController from "../controllers/point.js";
import {render, RenderPosition} from "../utils/render.js";
import {getPreparedEvents, getSortedEvents} from "../utils/common.js";
import {SortType} from "../const.js";

import {Mode} from "../const.js";

const renderDay = (siteTripDayListElement, points, offers, cities, onDataChange, onViewChange, onFavoriteChange, index = null, timestamp = null) => { // один день маршрута

  const siteTripDayElement = new DayComponent(timestamp, index);

  render(siteTripDayListElement.getElement(), siteTripDayElement, RenderPosition.BEFOREEND); // отрисовка trip-days__item

  const siteTripEventListElement = new EventsComponent();

  render(siteTripDayElement.getElement(), siteTripEventListElement, RenderPosition.BEFOREEND); // отрисовка trip-events__list

  return points.map((point) => {

    const pointController = new PointController(siteTripEventListElement, onDataChange, onViewChange, onFavoriteChange);

    pointController.render(point, offers, cities, Mode.DEFAULT);

    return pointController;

  });
};

const renderDays = (place, eventsGroups, offers, cities, onDataChange, onViewChange, onFavoriteChange) => {

  const controllers = [];

  Array.from(eventsGroups.entries()).forEach((eventsGroup, index) => {
    const [timestamp, points] = eventsGroup;
    const pointControllers = renderDay(place, points, offers, cities, onDataChange, onViewChange, onFavoriteChange, index, timestamp);

    controllers.push(...pointControllers);
  });

  return controllers;
};

export default class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._sortType = SortType.DEFAULT;
    this._createController = null;

    this._newEventBtn = document.querySelector(`.trip-main__event-add-btn`);

    this._pointControllers = [];
    this._eventsComponent = new EventsComponent();
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = new DaysComponent();

    this._onViewChange = this._onViewChange.bind(this);
    this._setDefaultViewControllers = this._setDefaultViewControllers.bind(this);
    this._onCloseCreateForm = this._onCloseCreateForm.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._reRender = this.renderContent.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._eventsModel.setFilterChangeHandler(this._onFilterTypeChange);

    this.addNewEventBtnClickHandler();
  }

  render(offers, cities) {
    const events = this._eventsModel.getEvents();
    this._offers = offers;
    this._cities = cities;

    if (events.size === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND); // отрисовка сообщения оо отсутствии точек
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.AFTERBEGIN); // отрисовка сортировки
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND); // отрисовка контейнера .trip-days

    this.renderContent();
  }

  createNewEvent() {
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
    this._eventsModel.updateEvent(oldData.id, newData);
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData.id === -1) {

      this._eventsModel.addEvent(newData);
      this._destroyCreateController();
      this.renderContent();

    } else if (newData === null) {
      const isSuccess = this._eventsModel.removeEvent(oldData.id);
      if (isSuccess) {
        pointController.destroy();
      }
    } else {
      const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

      if (isSuccess) {
        this.renderContent();
      }
    }
  }

  _onCloseCreateForm() {
    this._destroyCreateController();
    this._newEventBtn.disabled = false;
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
    this._newEventBtn.disabled = false;
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
      const groupedEvents = getPreparedEvents(this._eventsModel.getEvents(), this._sortType);
      this._pointControllers = renderDays(this._daysComponent, groupedEvents, this._offers, this._cities, this._onDataChange, this._onViewChange, this._onFavoriteChange);

      return;
    }

    const sortedEvents = getSortedEvents(this._eventsModel.getEvents(), this._sortType);
    this._pointControllers = renderDay(this._daysComponent, sortedEvents, this._offers, this._cities, this._onDataChange, this._onViewChange, this._onFavoriteChange);
  }

  addNewEventBtnClickHandler() {
    this._newEventBtn.addEventListener(`click`, () => {
      this._newEventBtn.disabled = true;
      this.createNewEvent();
      this._setDefaultViewControllers();
    });
  }
}
