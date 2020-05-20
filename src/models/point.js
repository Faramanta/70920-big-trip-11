export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.pointType = data[`type`];
    this.startTimestamp = new Date(data[`date_from`]).getTime();
    this.endTimestamp = new Date(data[`date_to`]).getTime();
    this.destination = data[`destination`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.pointOffers = data[`offers`] || {};
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }
}
