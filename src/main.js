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
import {render, RenderPosition, eventsGroups} from "./utils.js";

const renderDays = () => {
  Array.from(eventsGroups.entries()).forEach((eventsGroup, index) => {
    const [timestamp, points] = eventsGroup;
    renderDay(index, timestamp, points);
  });
};

const renderDay = (index, timestamp, points) => { // один день маршрута

  const siteTripDayElement = new DayComponent(timestamp, index).getElement();

  render(siteTripDayListElement, siteTripDayElement, RenderPosition.BEFOREEND); // отрисовка trip-days__item

  const siteTripEventListElement = new EventsComponent().getElement();

  render(siteTripDayElement, siteTripEventListElement, RenderPosition.BEFOREEND); // отрисовка trip-events__list

  points.forEach((dateEvent) => renderEvent(siteTripEventListElement, dateEvent));
};

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

renderDays();
