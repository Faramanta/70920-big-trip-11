import TripController from "./controllers/trip.js";
import TripInfoComponent from "./components/trip-information.js";
import RouteComponent from "./components/route-information.js";
import CostComponent from "./components/cost-information.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import NoEventsComponent from "./components/no-events.js";
import {getGroupedEvents} from "./utils.js";
import {render, RenderPosition} from "./utils/render.js";
import {generateTripEvents} from "./mock/trip-event.js";
import {EVENT_COUNT} from "./const.js";

const events = generateTripEvents(EVENT_COUNT);

events.sort((first, second) => {
  if (first.startTimestamp > second.startTimestamp) {
    return 1;
  }
  if (first.startTimestamp < second.startTimestamp) {
    return -1;
  }

  return 0;
});

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const siteContentElement = siteMainElement.querySelector(`.page-main`);
const siteTripInformationElement = siteHeaderElement.querySelector(`.trip-main`);

const tripInfo = new TripInfoComponent();

render(siteTripInformationElement, tripInfo, RenderPosition.AFTERBEGIN); // контейнер для маршрута и стоимости .trip-main__trip-info
render(tripInfo.getElement(), new CostComponent(), RenderPosition.BEFOREEND); // отрисовка стоимости маршрута

const siteMenuElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`); // контейнер для меню и фильтра

render(siteMenuElement, new MenuComponent(), RenderPosition.AFTERBEGIN); // отрисовка меню
render(siteMenuElement, new FilterComponent(), RenderPosition.BEFOREEND); // отрисовка фильтра

const siteEventContainerElement = siteContentElement.querySelector(`.trip-events`);

const eventsGroups = getGroupedEvents(events);

const tripController = new TripController(siteEventContainerElement);

if (eventsGroups.size !== 0) {
  render(tripInfo.getElement(), new RouteComponent(), RenderPosition.AFTERBEGIN); // отрисовка информации о маршруте
  tripController.render(eventsGroups);
} else {
  render(siteEventContainerElement, new NoEventsComponent(), RenderPosition.BEFOREEND); // отрисовка сообщения о точках
}
