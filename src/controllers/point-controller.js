import PointComponent from "../components/trip-event.js";
import PointEditComponent from "../components/trip-event-edit.js";
import PointModel from "../models/point.js";
import {getOfferUID, getTypeOffers} from "../utils/common.js";
import {render, remove, replace, RenderPosition} from "../utils/render.js";
import {KeyCode, Mode, ONE_SECOND, EMPTY_POINT, SHAKE_ANIMATION_TIMEOUT} from "../const.js";

const parseFormData = (formData, id, destinations, offers) => {
  const price = parseInt(formData.get(`event-price`), 10);
  const pointType = formData.get(`event-type`);
  const pointCity = formData.get(`event-destination`);
  const startTimestamp = parseInt(formData.get(`event-start-time`), 10) * ONE_SECOND;
  const endTimestamp = parseInt(formData.get(`event-end-time`), 10) * ONE_SECOND;
  const isFavorite = formData.get(`event-favorite`);
  const checkedOffersValues = formData.getAll(`event-offer`);

  const destination = destinations.find((item) => {
    return pointCity === item.name;
  });

  const offersTypeAll = getTypeOffers(offers, pointType); // все офферы типа

  const selectedOffers = offersTypeAll.filter((offer) => checkedOffersValues.includes(getOfferUID(offer.title, offer.price, id)));

  return new PointModel({
    id,
    "type": pointType,
    "base_price": price,
    "date_from": startTimestamp,
    "date_to": endTimestamp,
    "destination": destination,
    "offers": selectedOffers,
    "is_favorite": !!isFavorite,
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, onFavoriteChange, onCloseCreateForm = null, offers, destinations) {
    this._container = container;
    this._onCloseCreateForm = onCloseCreateForm;
    this._onDataChange = onDataChange;
    this._onFavoriteChange = onFavoriteChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._newPointBtn = document.querySelector(`.trip-main__event-add-btn`);

    this._offers = offers;
    this._destinations = destinations;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, offers, destinations, mode) {
    this._mode = mode;

    if (this._mode === Mode.ADDING) {
      this._renderAddMode(EMPTY_POINT, offers, destinations, this._mode);
    } else {
      this._renderDefaultOrEditMode(point, offers, destinations);
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

  _renderDefaultOrEditMode(point, offers, destinations) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, offers, destinations);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setFavoritesButtonClickHandler(() => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onFavoriteChange(this, point, newPoint);
      this._newPointBtn.disabled = true;
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData, point.id, destinations, offers);

      this._pointEditComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._newPointBtn.disabled = true;
      this._pointEditComponent.setDisableFormInput();
      this._pointEditComponent.removeErrorBorder();

      this._onDataChange(this, point, data);
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => {
      this._pointEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this._newPointBtn.disabled = true;
      this._pointEditComponent.setDisableFormInput();
      this._pointEditComponent.removeErrorBorder();

      this._onDataChange(this, point, null);
    });

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

  _renderAddMode(point, offers, destinations) {

    this._pointEditComponent = new PointEditComponent(point, offers, destinations, this._mode);

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData, point.id, destinations, offers);

      this._pointEditComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._pointEditComponent.setDisableFormInput();
      this._pointEditComponent.removeErrorBorder();

      this._onDataChange(this, point, data);
    });

    this._pointEditComponent.setCanselButtonClickHandler(() => this._onCloseCreateForm());

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

  shake() {
    this._pointEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / ONE_SECOND}s`;

    setTimeout(() => {
      this._pointEditComponent.getElement().style.animation = ``;
      this._pointEditComponent.setEnableFormInput();


      this._pointEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });

    }, SHAKE_ANIMATION_TIMEOUT);

    setTimeout(() => this._pointEditComponent.setErrorBorder(), SHAKE_ANIMATION_TIMEOUT);
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
