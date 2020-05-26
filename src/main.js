import API from "./api/api.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import TripController from "./controllers/trip-controller.js";
import FilterController from "./controllers/filter-controller.js";
import LoadingComponent from "./components/loading.js";
import TripInfoComponent from "./components/trip-information.js";
import MenuComponent from "./components/menu.js";
import StatsComponent from "./components/stats.js";
import PointModel from "./models/points.js";
import {render, remove, RenderPosition} from "./utils/render.js";
import {MenuItem, END_POINT, STORE_NAME} from "./const.js";

const AUTHORIZATION = `Basic e10w590wk271810`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointModel();
const loadingComponent = new LoadingComponent();

const siteMainElement = document.querySelector(`.page-body`);
const siteHeaderElement = siteMainElement.querySelector(`.page-header`);
const siteContentElement = siteMainElement.querySelector(`.page-main`);
const sitePageBodyContainerElement = siteContentElement.querySelector(`.page-body__container`);
const siteTripInformationElement = siteHeaderElement.querySelector(`.trip-main`);

const tripInfoComponent = new TripInfoComponent(pointsModel);
const siteMenu = new MenuComponent();

render(siteTripInformationElement, tripInfoComponent, RenderPosition.AFTERBEGIN); // контейнер для маршрута и стоимости .trip-main__trip-info
render(sitePageBodyContainerElement, loadingComponent, RenderPosition.BEFOREEND); // отрисовка loading...

const siteControlsElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`); // контейнер для меню и фильтра

render(siteControlsElement, siteMenu, RenderPosition.AFTERBEGIN); // отрисовка меню

const filterController = new FilterController(siteControlsElement, pointsModel);
filterController.render();

const sitePointContainerElement = siteContentElement.querySelector(`.trip-events`);

const tripController = new TripController(sitePointContainerElement, pointsModel, apiWithProvider);

const statisticComponent = new StatsComponent(pointsModel);

render(sitePageBodyContainerElement, statisticComponent, RenderPosition.BEFOREEND); // отрисовка статистики

siteMenu.setOnChange((menuItem) => {

  siteMenu.setActiveItem(menuItem);
  const newPointBtn = document.querySelector(`.trip-main__event-add-btn`);
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticComponent.hide();
      tripController.show();
      tripController.renderContent();
      newPointBtn.disabled = false;
      filterController.setActiveView(menuItem);
      break;
    case MenuItem.STATS:
      statisticComponent.show();
      tripController.hide();
      filterController.setActiveView(menuItem);
      newPointBtn.disabled = true;
      break;
  }
});

Promise.all([apiWithProvider.getPoints(), apiWithProvider.getOffers(), apiWithProvider.getDestinations()])
  .then(([points, offers, destinations]) => {
    pointsModel.setPoints(points);
    pointsModel.setOffers(offers);
    pointsModel.setDestinations(destinations);
    remove(loadingComponent);
    tripController.render(offers, destinations);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
    // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
