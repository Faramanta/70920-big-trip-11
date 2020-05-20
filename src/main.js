import API from "./api.js";
import TripController from "./controllers/trip-controller.js";
import FilterController from "./controllers/filter-controller.js";
import TripInfoComponent from "./components/trip-information.js";
import RouteComponent from "./components/route-information.js";
import CostComponent from "./components/cost-information.js";
import MenuComponent from "./components/menu.js";
import StatsComponent from "./components/stats.js";
import PointModel from "./models/points.js";
import {render, RenderPosition} from "./utils/render.js";
import {DefaultOffers} from "./mock/trip-event.js";
import {CITIES, MenuItem} from "./const.js";

const AUTHORIZATION = `Basic eo0w590ik29889b`;

const api = new API(AUTHORIZATION);

const pointsModel = new PointModel();

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const siteContentElement = siteMainElement.querySelector(`.page-main`);
const sitePageBodyContainerElement = siteContentElement.querySelector(`.page-body__container`);
const siteTripInformationElement = siteHeaderElement.querySelector(`.trip-main`);

const tripInfo = new TripInfoComponent();
const siteMenu = new MenuComponent();

render(siteTripInformationElement, tripInfo, RenderPosition.AFTERBEGIN); // контейнер для маршрута и стоимости .trip-main__trip-info
render(tripInfo.getElement(), new CostComponent(), RenderPosition.BEFOREEND); // отрисовка стоимости маршрута

const siteControlsElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`); // контейнер для меню и фильтра

render(siteControlsElement, siteMenu, RenderPosition.AFTERBEGIN); // отрисовка мен

const filterController = new FilterController(siteControlsElement, pointsModel);
filterController.render();

const sitePointContainerElement = siteContentElement.querySelector(`.trip-events`);

const tripController = new TripController(sitePointContainerElement, pointsModel, api);

if (pointsModel.size !== 0) {
  render(tripInfo.getElement(), new RouteComponent(), RenderPosition.AFTERBEGIN); // отрисовка информации о маршруте
}

// tripController.render(DefaultOffers, CITIES);

const statisticComponent = new StatsComponent(pointsModel);

render(sitePageBodyContainerElement, statisticComponent, RenderPosition.BEFOREEND); // отрисовка статистики

siteMenu.setOnChange((menuItem) => {
  siteMenu.setActiveItem(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticComponent.hide();
      tripController.show();
      tripController.renderContent();
      break;
    case MenuItem.STATS:
      statisticComponent.show();
      tripController.hide();
      break;
  }
});

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(points);
    tripController.render(DefaultOffers, CITIES);
  });
