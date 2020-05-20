export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.pointType = data[`type`];
    this.startTimestamp = new Date(data[`date_from`]).getTime();
    this.endTimestamp = new Date(data[`date_to`]).getTime();
    this.pointCity = data[`destination`][`name`];
    this.pointDestination = data[`destination`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.pointOffers = data[`offers`] || {};
  }

  toRAW() {
    return {
      "base_price": this.price,
      "type": this.pointType,
      "date_from": this.startTimestamp,
      "date_to": this.endTimestamp,
      "destination": {},
      "is_favorite": this.isFavorite,
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
