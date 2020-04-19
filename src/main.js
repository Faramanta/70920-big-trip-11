import {createTripInformationTemplate} from "./components/trip-information.js";
import {createRouteInformationTemplate} from "./components/route-information.js";
import {createCostInformationTemplate} from "./components/cost-information.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFiltersTemplate} from "./components/filter.js";
import {createSortTemplate} from "./components/sorting.js";
import {createTripDayListTemplate} from "./components/trip-day-list.js";
import {createTripDayItemTemplate} from "./components/trip-day-item.js";
import {createTripEventsListTemplate} from "./components/trip-event-list.js";
import {createTripEventTemplate} from "./components/trip-event.js";
import {createTripEventEditTemplate} from "./components/trip-event-edit.js";
import {generateTripEvents} from "./mock/trip-event.js";
import {EVENT_COUNT} from "./const.js";


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const siteContentElement = siteMainElement.querySelector(`.page-main`);

const siteTripInformationElement = siteHeaderElement.querySelector(`.trip-main`);

render(siteTripInformationElement, createTripInformationTemplate(), `afterbegin`); // отрисовка контейнера информации о маршруте

const siteRouteElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);

render(siteRouteElement, createRouteInformationTemplate(), `afterbegin`); // отрисовка информации о маршруте
render(siteRouteElement, createCostInformationTemplate()); // отрисовка стоимости поездки

const siteMenuElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const siteMenuTitleElement = siteMenuElement.querySelector(`h2`); // найти первый h2 в блоке

render(siteMenuTitleElement, createMenuTemplate(), `afterend`); // отрисовка меню после первого h2
render(siteMenuElement, createFiltersTemplate()); // отрисовка фильтров

const siteEventContainerElement = siteContentElement.querySelector(`.trip-events`);

render(siteEventContainerElement, createSortTemplate()); // отрисовка сортировки

const events = generateTripEvents(EVENT_COUNT);

const eventsGroup = new Map();
events.forEach((event) => {
  const startEventDate = new Date(event.startTimestamp);

  const startDay = new Date(startEventDate.getFullYear(), startEventDate.getMonth(), startEventDate.getDate(), 0, 0, 0, 0);
  const endDay = new Date(startEventDate.getFullYear(), startEventDate.getMonth(), startEventDate.getDate(), 23, 59, 59, 999);

  const startTimestampDay = startDay.getTime();
  const endTimestampDay = endDay.getTime();

  if (!eventsGroup.has(startTimestampDay)) {
    const dayEvents = events.filter((event1) => {

      return startTimestampDay <= event1.startTimestamp && event1.startTimestamp <= endTimestampDay;

    });

    eventsGroup.set(startTimestampDay, dayEvents);
  }
});

render(siteEventContainerElement, createTripDayListTemplate()); // отрисовка контейнера-списка для дней trip-days

const siteTripDayListElement = siteContentElement.querySelector(`.trip-days`);

eventsGroup.forEach((dateEvents, dateNum) => {
  render(siteTripDayListElement, createTripDayItemTemplate(dateNum)); // элемент списка дней, один день trip-days__item

  const siteTripDateElement = siteTripDayListElement.querySelector(`.trip-days__item`);

  render(siteTripDateElement, createTripEventsListTemplate(dateEvents)); // список точек маршрута trip-events__list

  const siteTripEventListElement = siteTripDateElement.querySelector(`.trip-events__list`);

  render(siteTripEventListElement, createTripEventEditTemplate(dateEvents[0])); // форма создания/редактирования

  dateEvents.forEach((dateEvent) => render(siteTripEventListElement, createTripEventTemplate(dateEvent)));

});
