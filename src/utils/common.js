import moment from "moment";
import {SortType} from "../const.js";

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const eventTime = (timestamp) => {
  return moment(timestamp).format(`HH:mm`);
};
export const eventISOTime = (timestamp) => {
  return moment(timestamp).format(`YYYY-mm-DTHH:mm`);
};

export const eventDuration = (start, end) => {
  const eventStart = moment(start);
  const eventEnd = moment(end);
  const duration = eventEnd.diff(eventStart); // продолжительность точки

  const eventDurDay = moment.duration(duration).days(); // количество дней
  const eventDurHour = moment.duration(duration).hours(); // количество часов
  const eventDurMin = moment.duration(duration).minutes(); // количество минут

  const days = eventDurDay > 0 ? castTimeFormat(eventDurDay) + `D` : ``;
  const hours = eventDurHour > 0 ? castTimeFormat(eventDurHour) + `H` : ``;
  const minutes = eventDurMin > 0 ? castTimeFormat(eventDurMin) + `M` : `00M`;

  return `${days} ${hours} ${minutes}`;
};

export const getEventDuration = (start, end) => {
  const eventStart = moment(start);
  const eventEnd = moment(end);
  return eventEnd.diff(eventStart);
};

export const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const showingEvents = events.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedEvents = showingEvents.sort((a, b) => a.startTimestamp > b.startTimestamp);
      break;
    case SortType.TIME:
      sortedEvents = showingEvents.sort((a, b) => {
        return getEventDuration(b.startTimestamp, b.endTimestamp) - getEventDuration(a.startTimestamp, a.endTimestamp);
      });
      break;
    case SortType.PRICE:
      sortedEvents = showingEvents.sort((a, b) => b.price - a.price);
      break;
  }

  return sortedEvents;
};

export const getGroupedEvents = (events) => {
  const eventsGroups = new Map();
  events.forEach((event) => {
    const startEventDate = new Date(event.startTimestamp);

    const startDay = new Date(startEventDate.getFullYear(), startEventDate.getMonth(), startEventDate.getDate(), 0, 0, 0, 0);
    const endDay = new Date(startEventDate.getFullYear(), startEventDate.getMonth(), startEventDate.getDate(), 23, 59, 59, 999);

    const startTimestampDay = startDay.getTime();
    const endTimestampDay = endDay.getTime();

    if (!eventsGroups.has(startTimestampDay)) {
      const dayEvents = events.filter((event1) => {

        return startTimestampDay <= event1.startTimestamp && event1.startTimestamp <= endTimestampDay;

      });

      eventsGroups.set(startTimestampDay, dayEvents);
    }
  });

  return eventsGroups;
};

export const getPreparedEvents = (events, sortType = SortType.DEFAULT) => {
  const sortedEvents = getSortedEvents(events, sortType);
  const groupedEvents = getGroupedEvents(sortedEvents);

  return groupedEvents;
};
