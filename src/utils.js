const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : Number(value);
};

export const eventTime = (timestamp) => {
  const hours = castTimeFormat(new Date(timestamp).getHours() % 12);
  const minutes = castTimeFormat(new Date(timestamp).getMinutes());

  return `${hours}:${minutes}`;
};
