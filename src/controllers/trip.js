import SortComponent from "../components/sort.js";
import DaysComponent from "../components/trip-day-list.js";
import DayComponent from "../components/trip-day-item.js";
import EventsComponent from "../components/trip-event-list.js";
import NoEventsComponent from "../components/no-events.js";
import PointController from "../controllers/point.js";
import {render, RenderPosition} from "../utils/render.js";
import {getPreparedEvents, getSortedEvents} from "../utils/common.js";
import {SortType} from "../const.js";

const renderDay = (siteTripDayListElement, points, offers, cities, onDataChange, index = null, timestamp = null, onViewChange) => { // один день маршрута

  const siteTripDayElement = new DayComponent(timestamp, index);

  render(siteTripDayListElement.getElement(), siteTripDayElement, RenderPosition.BEFOREEND); // отрисовка trip-days__item

  const siteTripEventListElement = new EventsComponent();

  render(siteTripDayElement.getElement(), siteTripEventListElement, RenderPosition.BEFOREEND); // отрисовка trip-events__list

  return points.map((point) => {

    const pointController = new PointController(siteTripEventListElement, onDataChange, onViewChange);

    pointController.render(point, offers, cities);

    return pointController;

  });
};


const renderDays = (place, eventsGroups, offers, cities, onDataChange, onViewChange) => {

  const controllers = [];

  Array.from(eventsGroups.entries()).forEach((eventsGroup, index) => {
    const [timestamp, points] = eventsGroup;
    const pointController = renderDay(place, points, offers, cities, onDataChange, index, timestamp, onViewChange);

    controllers.push(...pointController);
  });

  return controllers;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this.events = [];
    this._pointControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = new DaysComponent();

    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(events, offers, cities) {
    this._events = events;
    this._offers = offers;
    this._cities = cities;

    if (events.size === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND); // отрисовка сообщения оо отсутствии точек
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.AFTERBEGIN); // отрисовка сортировки
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND); // отрисовка контейнера .trip-days

    const eventsGroups = getPreparedEvents(this._events);

    const pointControllers = renderDays(this._daysComponent, eventsGroups, offers, cities, this._onDataChange, this._onViewChange);

    this._pointControllers = pointControllers;
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());

  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it.id === oldData.id);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.render(this._events[index], this._offers, this._cities);
  }

  _onSortTypeChange(sortType) {

    const daysListElement = this._daysComponent.getElement(); // .trip-days
    daysListElement.innerHTML = ``;

    if (sortType === SortType.DEFAULT) {
      const defaultEventsGroup = getPreparedEvents(this._events);

      renderDays(this._daysComponent, defaultEventsGroup, this._offers, this._cities);

      return;
    }

    const sortedEvents = getSortedEvents(this._events, sortType);

    renderDay(this._daysComponent, sortedEvents, this._offers, this._cities);
  }
}
