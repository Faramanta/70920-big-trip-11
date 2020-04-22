import {MONTH} from "../const.js";
import {createElement} from "../utils.js";

// Элемент списка дней (один день)
const createTripDayItemTemplate = (dateNum, index) => {
  const date = new Date(dateNum[0]);
  const month = (date.getMonth() - 1);
  const monthName = MONTH[month];
  const dayNum = date.getDate();
  const dayIndex = index + 1;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayIndex}</span>
        <time class="day__date" datetime="2019-03-18">${monthName} ${dayNum}</time>
      </div>
    </li>`
  );
};

export default class Day {
  constructor(dateNum, index) {
    this._dateNum = dateNum;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createTripDayItemTemplate(this._dateNum, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
