import {createTripInformationTemplate} from "./components/trip-information.js";
import {createRouteInformationTemplate} from "./components/route-information.js";
import {createCostInformationTemplate} from "./components/cost-information.js";
import {createSiteMenuTemplate} from "./components/menu.js";
import {createSiteFiltersTemplate} from "./components/filter.js";
import {createSiteSortTemplate} from "./components/sorting.js";
import {createTripDayListTemplate} from "./components/trip-day-list.js";
import {createTripDayItemTemplate} from "./components/trip-day-item.js";
import {createTripDateInformationTemplate} from "./components/trip-date.js";
import {createTripEventsListTemplate} from "./components/trip-event-list.js";
import {createTripEventTemplate} from "./components/trip-event.js";
import {createTripEventEditTemplate} from "./components/trip-event-edit.js";
import {generateTripEvents} from "./mock/trip-event.js";

const EVENT_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const siteContentElement = siteMainElement.querySelector(`.page-main`);

const siteTripInformationElement = siteHeaderElement.querySelector(`.trip-main`);

render(siteTripInformationElement, createTripInformationTemplate(), `afterbegin`); // отрисовка контейнера информации о маршруте

const siteRouteInformationElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);

render(siteRouteInformationElement, createRouteInformationTemplate(), `afterbegin`); // отрисовка информации о маршруте
render(siteRouteInformationElement, createCostInformationTemplate()); // отрисовка стоимости поездки

const siteMenuElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const siteMenuTitleElement = siteMenuElement.querySelector(`h2`); // найти первый h2 в блоке

render(siteMenuTitleElement, createSiteMenuTemplate(), `afterend`); // отрисовка меню после первого h2
render(siteMenuElement, createSiteFiltersTemplate()); // отрисовка фильтров

const siteEventContainerElement = siteContentElement.querySelector(`.trip-events`);


const events = generateTripEvents(EVENT_COUNT);


render(siteEventContainerElement, createSiteSortTemplate()); // отрисовка сортировки
render(siteEventContainerElement, createTripDayListTemplate()); // отрисовка контейнера-списка для дней

const siteTripDayListElement = siteContentElement.querySelector(`.trip-days`);

render(siteTripDayListElement, createTripDayItemTemplate()); // элемент списка дней, один день

const siteTripDateInformationElement = siteTripDayListElement.querySelector(`.trip-days__item`);

render(siteTripDateInformationElement, createTripDateInformationTemplate()); // дата
render(siteTripDateInformationElement, createTripEventsListTemplate()); // список точек маршрута

const siteTripEventListElement = siteTripDateInformationElement.querySelector(`.trip-events__list`);

render(siteTripEventListElement, createTripEventEditTemplate(events[0])); // форма создания/редактирования

for (let i = 1; i <= events.length; i++) {
  render(siteTripEventListElement, createTripEventTemplate(events[i])); // точка маршрута
}
