import AbstractComponent from "./abstract-components";

// стоимость
const createCostInformationTemplate = () => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>`
  );
};

export default class Cost extends AbstractComponent {
  getTemplate() {
    return createCostInformationTemplate();
  }
}
