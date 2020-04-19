import {MONTH} from "../const.js";

// Элемент списка дней (один день)
export const createTripDayItemTemplate = (dateNum) => {
  const month = (new Date(dateNum).getMonth() - 1);
  const monthName = MONTH[month];
  const dayNum = new Date(dateNum).getDate();

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter"></span>
        <time class="day__date" datetime="2019-03-18">${monthName} ${dayNum}</time>
      </div>
    </li>`
  );
};
