import {MONTH} from "../const.js";

// Элемент списка дней (один день)
export const createTripDayItemTemplate = (dateNum, index) => {
  const date = new Date(dateNum);
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
