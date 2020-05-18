import EventComponent from "../components/trip-event.js";
import EventEditComponent from "../components/trip-event-edit.js";
import {render, remove, replace, RenderPosition} from "../utils/render.js";
import {KeyCode, Mode, EventType} from "../const.js";

const EMPTY_EVENT = {
  destination: null,
  endTimestamp: new Date().getTime(),
  eventCity: ``,
  eventOffers: [],
  eventType: EventType.TAXI,
  id: -1,
  isFavorite: false,
  price: 0,
  startTimestamp: new Date().getTime(),
  timestamp: new Date().getTime()
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, onFavoriteChange, onCloseCreateForm = null) {
    this._container = container;
    this._onCloseCreateForm = onCloseCreateForm;
    this._onDataChange = onDataChange;
    this._onFavoriteChange = onFavoriteChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, offers, cities, mode) {

    this._mode = mode;

    if (this._mode === Mode.ADDING) {
      this._renderAddMode(EMPTY_EVENT, offers, cities);
      return;
    } else {
      this._renderDefaultOrEditMode(event, offers, cities);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._eventEditComponent);
    if (this._eventComponent) {
      remove(this._eventComponent);
    }

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _renderDefaultOrEditMode(event, offers, cities) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, offers, cities);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      this._onFavoriteChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      if (this._eventEditComponent.isFormValid) {
        const data = this._eventEditComponent.getData();
        this._onDataChange(this, event, data);
      }
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, event, null));

    switch (this._mode) {
      case Mode.DEFAULT:
        if (oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;

      case Mode.EDIT:
        if (oldEventEditComponent) {
          oldEventEditComponent.destroy();
          replace(this._eventEditComponent, oldEventEditComponent);
        } else {
          render(this._container, this._eventEditComponent, RenderPosition.BEFOREEND);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        break;
    }
  }

  _renderAddMode(event, offers, cities) {

    this._eventEditComponent = new EventEditComponent(event, offers, cities);

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      this._onFavoriteChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      if (this._eventEditComponent.isFormValid) {
        const data = this._eventEditComponent.getData();
        this._onDataChange(this, event, data);
      }
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, event, null));

    document.addEventListener(`keydown`, this._onEscKeyDown);
    render(this._container, this._eventEditComponent, RenderPosition.AFTERBEGIN);
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
      if (this._mode === Mode.ADDING) {
        this._onCloseCreateForm();
      } else {
        this._replaceEditToEvent();
      }
    }
  }
}
