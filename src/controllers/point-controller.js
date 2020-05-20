import PointComponent from "../components/trip-event.js";
import PointEditComponent from "../components/trip-event-edit.js";
import {render, remove, replace, RenderPosition} from "../utils/render.js";
import {KeyCode, Mode, PointType} from "../const.js";

const EMPTY_POINT = {
  destination: null,
  endTimestamp: new Date().getTime(),
  pointCity: ``,
  pointOffers: [],
  pointType: PointType.TAXI,
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

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, offers, cities, mode) {

    this._mode = mode;

    if (this._mode === Mode.ADDING) {
      this._renderAddMode(EMPTY_POINT, offers, cities);
      return;
    } else {
      this._renderDefaultOrEditMode(point, offers, cities);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._pointEditComponent);
    if (this._pointComponent) {
      remove(this._pointComponent);
    }

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _renderDefaultOrEditMode(point, offers, cities) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, offers, cities);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setFavoritesButtonClickHandler(() => {
      this._onFavoriteChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      if (this._pointEditComponent.isFormValid) {
        const data = this._pointEditComponent.getData();
        this._onDataChange(this, point, data);
      }
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));

    switch (this._mode) {
      case Mode.DEFAULT:
        if (oldPointComponent) {
          replace(this._pointComponent, oldPointComponent);
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;

      case Mode.EDIT:
        if (oldPointEditComponent) {
          oldPointEditComponent.destroy();
          replace(this._pointEditComponent, oldPointEditComponent);
        } else {
          render(this._container, this._pointEditComponent, RenderPosition.BEFOREEND);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        break;
    }
  }

  _renderAddMode(point, offers, cities) {

    this._pointEditComponent = new PointEditComponent(point, offers, cities);

    this._pointEditComponent.setFavoritesButtonClickHandler(() => {
      this._onFavoriteChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      if (this._pointEditComponent.isFormValid) {
        const data = this._pointEditComponent.getData();
        this._onDataChange(this, point, data);
      }
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));

    document.addEventListener(`keydown`, this._onEscKeyDown);
    render(this._container, this._pointEditComponent, RenderPosition.AFTERBEGIN);
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointEditComponent.reset();
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === KeyCode.ESC || evt.key === KeyCode.ESCAPE;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onCloseCreateForm();
      } else {
        this._replaceEditToPoint();
      }
    }
  }
}
