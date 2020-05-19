import AbstractSmartComponent from "./abstract-smart-component.js";
import {EVENT_TYPES_TRANSPORT,
  typeIcons,
  ChartTitle,
  chartOptions} from "../const.js";
import {getEventsType,
  calculateTypeCount,
  calculateTypePrice,
  calculateTypeDuration,
  eventDurationFormat} from "../utils/common.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 46;

const getChartConfig = (types, data, title, formatter) => {
  return {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data,
        backgroundColor: chartOptions.datasetsBackgroundColor,
        hoverBackgroundColor: chartOptions.datasetsHoverBackgroundColor,
        anchor: chartOptions.datasetsAnchor
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: chartOptions.datalabelsFontSize
          },
          color: chartOptions.datalabelsColor,
          anchor: chartOptions.datalabelAnchor,
          align: chartOptions.datalabelAlign,
          formatter
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: chartOptions.titleFontColor,
        fontSize: chartOptions.titleFontSize,
        position: chartOptions.titlePosition
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: chartOptions.ticksFontColor,
            padding: chartOptions.ticksPadding,
            fontSize: chartOptions.ticksFontSize,
            callback: (type) => {
              return `${typeIcons[type]} ${type}`;
            },
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: chartOptions.barThickness,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: chartOptions.minBarLength
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  };
};

const renderMoneyChart = (chart, events) => {

  const eventTypes = getEventsType(events);
  const data = eventTypes.map((type) => calculateTypePrice(events, type));
  const formatter = (val) => `€ ${val}`;

  chart.height = BAR_HEIGHT * eventTypes.length;

  return new Chart(chart, getChartConfig(eventTypes, data, ChartTitle.MONEY, formatter));
};

const renderTransportChart = (chart, events) => {

  const eventTypes = getEventsType(events).filter((type) => type.indexOf() !== EVENT_TYPES_TRANSPORT.indexOf(type));
  const data = eventTypes.map((type) => calculateTypeCount(events, type));
  const formatter = (val) => `${val}x`;

  chart.height = BAR_HEIGHT * eventTypes.length;

  return new Chart(chart, getChartConfig(eventTypes, data, ChartTitle.TRANSPORT, formatter));
};

const renderTimeSpendChart = (chart, events) => {

  const eventTypes = getEventsType(events);
  const data = eventTypes.map((type) => calculateTypeDuration(events, type));

  const formatter = (val) => {
    return eventDurationFormat(val);
  };

  chart.height = BAR_HEIGHT * eventTypes.length;

  return new Chart(chart, getChartConfig(eventTypes, data, ChartTitle.TIME_SPEND, formatter));
};

const createStatsTemplate = () => {
  return (
    `<section class="statistics visually-hidden">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Stats extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._events = events;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._events);
  }

  recoveryListeners() {}

  rerender(events) {
    this._events = events;

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const events = this._events.getEvents();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, events);
    this._transportChart = renderTransportChart(transportCtx, events);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, events);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }
    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }
    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}
