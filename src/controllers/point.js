import EventComponent from "../components/trip-event.js";
import EventEditComponent from "../components/trip-event-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {KeyCode, Mode} from "../const.js";


export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, offers, cities) {

    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, offers, cities);

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

    if (oldEventComponent && oldEventEditComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._eventEditComponent, oldEventEditComponent);
    } else {
      render(this._container.getElement(), this._eventComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._eventEditComponent.reset();
    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === KeyCode.ESC || evt.key === KeyCode.ESCAPE;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
