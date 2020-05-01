import SortComponent from "../components/sort.js";
import DaysComponent from "../components/trip-day-list.js";
import DayComponent from "../components/trip-day-item.js";
import EventsComponent from "../components/trip-event-list.js";
import EventComponent from "../components/trip-event.js";
import EventEditComponent from "../components/trip-event-edit.js";
import NoEventsComponent from "../components/no-events.js";
import {getTypeOffers} from "../mock/trip-event.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {KeyCode} from "../const.js";

const renderDay = (siteTripDayListElement, index, timestamp, points, offers, cities) => { // один день маршрута

  const siteTripDayElement = new DayComponent(timestamp, index);

  render(siteTripDayListElement.getElement(), siteTripDayElement, RenderPosition.BEFOREEND); // отрисовка trip-days__item

  const siteTripEventListElement = new EventsComponent();

  render(siteTripDayElement.getElement(), siteTripEventListElement, RenderPosition.BEFOREEND); // отрисовка trip-events__list

  points.forEach((dateEvent) => renderEvent(siteTripEventListElement, dateEvent, offers, cities));
};

const renderEvent = (eventListElement, event, offers, cities) => {

  const replaceEventToEdit = () => {
    replace(eventListElement, eventEditComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventListElement, eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === KeyCode.ESC || evt.key === KeyCode.ESCAPE;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const offersTypeAll = getTypeOffers(offers, event.eventType); // Все офферы нужного типа

  const eventComponent = new EventComponent(event);
  const eventEditComponent = new EventEditComponent(event, offersTypeAll, cities);

  eventComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement.getElement(), eventComponent, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = new DaysComponent();
  }

  render(eventsGroups, offers, cities) {

    if (eventsGroups.size === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND); // отрисовка сообщения о точках
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.AFTERBEGIN); // отрисовка сортировки
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND); // отрисовка контейнера .trip-days

    Array.from(eventsGroups.entries()).forEach((eventsGroup, index) => {
      const [timestamp, points] = eventsGroup;
      renderDay(this._daysComponent, index, timestamp, points, offers, cities);
    });
  }
}
