import {ONE_DAY, ONE_HOUR, ONE_MINUTE} from "./const.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : Number(value);
};

export const eventTime = (timestamp) => {
  const hours = castTimeFormat(new Date(timestamp).getHours());
  const minutes = castTimeFormat(new Date(timestamp).getMinutes());

  return `${hours}:${minutes}`;
};

export const eventDuration = (start, end) => {
  const duration = (end - start); // разница времени старта и финиша

  const eventDurDay = Math.floor(duration / ONE_DAY); // количество дней
  const eventDurHour = Math.floor((duration - (eventDurDay * ONE_HOUR)) / ONE_HOUR); // количество часов
  const eventDurMin = Math.floor((duration - (eventDurDay * ONE_DAY) - (eventDurHour * ONE_HOUR)) / ONE_MINUTE);

  const days = eventDurDay > 0 ? castTimeFormat(eventDurDay) + `D` : ``;
  const hours = eventDurHour > 0 ? castTimeFormat(eventDurHour) + `H` : `00H`;
  const minutes = eventDurMin > 0 ? castTimeFormat(eventDurMin) + `M` : `00M`;

  return `${days} ${hours} ${minutes}`;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
