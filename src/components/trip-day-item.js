import AbstractComponent from "./abstract-components";
import {MONTHS} from "../const.js";

// Элемент списка дней (один день)
const createTripDayItemTemplate = (timestamp, index) => {
  const date = new Date(timestamp);
  const month = (date.getMonth() - 1);
  const monthName = MONTHS[month];
  const dayNum = date.getDate();
  const dayIndex = index + 1;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayIndex ? dayIndex : ``}</span>
        <time class="day__date" datetime="2019-03-18">${monthName ? monthName : ``} ${dayNum ? dayNum : ``}</time>
      </div>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(timestamp, index) {
    super();

    this._timestamp = timestamp;
    this._index = index;
  }

  getTemplate() {
    return createTripDayItemTemplate(this._timestamp, this._index);
  }
}
