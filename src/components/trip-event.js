import {getRandomIntegerNumber} from "../mock/trip-event.js";
import {eventTime} from "../utils.js";

// Точка маршрута

// рендер offer'а
const createOffersMarkup = (offers) => {
  return offers
    .map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    })
    .join(`\n`);
};

export const createTripEventTemplate = (event) => {
  const {eventType, eventCity, timestamp, randomOffers} = event;

  const newTimestamp = timestamp + getRandomIntegerNumber(1800000, 3000000); // рандомное число для расчета времени финиша точки маршрута
  const eventTimeStart = eventTime(timestamp); // время старта
  const eventTimeEnd = eventTime(newTimestamp); // время финиша
  const eventTimeDur = new Date(newTimestamp - timestamp).getMinutes(); // разница времени старта и финиша

  const isOffersShowing = !!randomOffers; // есть ли offers
  const offersMarkup = isOffersShowing ? createOffersMarkup(randomOffers) : ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventType} to ${eventCity}</h3>
  
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${eventTimeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${eventTimeEnd}</time>
          </p>
          <p class="event__duration">${eventTimeDur}M</p>
        </div>
  
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">20</span>
        </p>
        
${isOffersShowing ?
      `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
    ${offersMarkup}
    </ul>`
      : ``
    }
  
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
