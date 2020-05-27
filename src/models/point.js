import {getDateToRAW} from "../utils/common.js";

export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.pointType = data[`type`];
    this.startTimestamp = new Date(data[`date_from`]);
    this.endTimestamp = new Date(data[`date_to`]);
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.pointDestination = data[`destination`];
    this.pointOffers = data[`offers`] || [];
  }

  toRAW() {
    return {
      "id": this.id,
      "base_price": this.price,
      "type": this.pointType,
      "date_from": getDateToRAW(this.startTimestamp),
      "date_to": this.endTimestamp,
      "destination": this.pointDestination,
      "is_favorite": this.isFavorite,
      "offers": this.pointOffers,
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
