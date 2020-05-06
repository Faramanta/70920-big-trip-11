import EventComponent from "../components/trip-event.js";
import EventEditComponent from "../components/trip-event-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getTypeOffers} from "../mock/trip-event.js";
import {KeyCode} from "../const.js";

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, offers, cities) {

    const offersTypeAll = getTypeOffers(offers, event.eventType); // Все офферы нужного типа

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, offersTypeAll, cities);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });

    render(this._container.getElement(), this._eventComponent, RenderPosition.BEFOREEND);
  }

  _replaceEventToEdit() {
    replace(this._eventEditComponent, this._eventComponent);
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._eventComponent, this._eventEditComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === KeyCode.ESC || evt.key === KeyCode.ESCAPE;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
