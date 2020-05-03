import TripController from "./controllers/trip.js";
import TripInfoComponent from "./components/trip-information.js";
import RouteComponent from "./components/route-information.js";
import CostComponent from "./components/cost-information.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import {generateTripEvents, DefaultOffers} from "./mock/trip-event.js";
import {EVENT_COUNT, CITIES} from "./const.js";

const events = generateTripEvents(EVENT_COUNT);

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

const tripController = new TripController(siteEventContainerElement);

if (events.size !== 0) {
  render(tripInfo.getElement(), new RouteComponent(), RenderPosition.AFTERBEGIN); // отрисовка информации о маршруте
}

tripController.render(events, DefaultOffers, CITIES);
