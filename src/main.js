import TripComponent from "./components/trip-information.js";
import RouteComponent from "./components/route-information.js";
import CostComponent from "./components/cost-information.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import SortComponent from "./components/sort.js";
import DaysComponent from "./components/trip-day-list.js";
import DayComponent from "./components/trip-day-item.js";
import EventsComponent from "./components/trip-event-list.js";
import EventComponent from "./components/trip-event.js";
import EventEditComponent from "./components/trip-event-edit.js";
import {generateTripEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils.js";
import {EVENT_COUNT} from "./const.js";

const events = generateTripEvents(EVENT_COUNT);

const eventsGroups = new Map();
events.forEach((event) => {
  const startEventDate = new Date(event.startTimestamp);

  const startDay = new Date(startEventDate.getFullYear(), startEventDate.getMonth(), startEventDate.getDate(), 0, 0, 0, 0);
  const endDay = new Date(startEventDate.getFullYear(), startEventDate.getMonth(), startEventDate.getDate(), 23, 59, 59, 999);

  const startTimestampDay = startDay.getTime();
  const endTimestampDay = endDay.getTime();

  if (!eventsGroups.has(startTimestampDay)) {
    const dayEvents = events.filter((event1) => {

      return startTimestampDay <= event1.startTimestamp && event1.startTimestamp <= endTimestampDay;

    });

    eventsGroups.set(startTimestampDay, dayEvents);
  }
});

const renderEvent = (eventListElement, event) => {

  const onEditButtonClick = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const onEditFormSubmitClick = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const eventComponent = new EventComponent(event);
  const eventEditComponent = new EventEditComponent(event);
  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  const editForm = eventEditComponent.getElement().querySelector(`form`);
  editButton.addEventListener(`click`, onEditButtonClick);
  editForm.addEventListener(`click`, onEditFormSubmitClick);

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderDay = () => { // один день маршрута
  Array.from(eventsGroups.entries())
    .forEach((eventGroup, index) => {
      const [, dateEvents] = eventGroup;

      render(siteTripDayListElement, new DayComponent(eventGroup, index).getElement(), RenderPosition.BEFOREEND); // отрисовка trip-days__item

      const siteTripDayElement = (siteTripDayListElement.querySelectorAll(`.trip-days__item`)[index]);

      render(siteTripDayElement, new EventsComponent().getElement(), RenderPosition.BEFOREEND); // отрисовка trip-events__list

      const siteTripEventListElement = siteTripDayElement.querySelector(`.trip-events__list`);

      dateEvents.forEach((dateEvent) => renderEvent(siteTripEventListElement, dateEvent));
    });
};

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const siteContentElement = siteMainElement.querySelector(`.page-main`);
const siteTripInformationElement = siteHeaderElement.querySelector(`.trip-main`);

render(siteTripInformationElement, new TripComponent().getElement(), RenderPosition.AFTERBEGIN); // контейнер для маршрута и стоимости

const siteRouteElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);

render(siteRouteElement, new RouteComponent().getElement(), RenderPosition.AFTERBEGIN); // отрисовка информации о маршруте
render(siteRouteElement, new CostComponent().getElement(), RenderPosition.BEFOREEND); // отрисовка стоимости маршрута

const siteMenuElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`); // контейнер для меню и фильтра

render(siteMenuElement, new MenuComponent().getElement(), RenderPosition.AFTERBEGIN); // отрисовка меню
render(siteMenuElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND); // отрисовка фильтра

const siteEventContainerElement = siteContentElement.querySelector(`.trip-events`);

render(siteEventContainerElement, new SortComponent().getElement(), RenderPosition.BEFOREEND); // отрисовка сортировки
render(siteEventContainerElement, new DaysComponent().getElement(), RenderPosition.BEFOREEND); // отрисовка контейнера .trip-days

const siteTripDayListElement = siteContentElement.querySelector(`.trip-days`);

const dayComponent = new DayComponent();
renderDay(dayComponent, events);
