import AbstractSmartComponent from "./abstract-smart-component.js";
import {POINT_TYPES_TRANSPORT,
  typeIcons,
  ChartTitle,
  chartOptions} from "../const.js";
import {getPointsType,
  calculateTypeCount,
  calculateTypePrice,
  calculateTypeDuration,
  pointDurationFormat} from "../utils/common.js";
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

const renderMoneyChart = (chart, points) => {

  const pointTypes = getPointsType(points);
  const data = pointTypes.map((type) => calculateTypePrice(points, type));
  const formatter = (val) => `€ ${val}`;

  chart.height = BAR_HEIGHT * pointTypes.length;

  return new Chart(chart, getChartConfig(pointTypes, data, ChartTitle.MONEY, formatter));
};

const renderTransportChart = (chart, points) => {

  const pointTypes = getPointsType(points).filter((type) => type.indexOf() !== POINT_TYPES_TRANSPORT.indexOf(type));
  const data = pointTypes.map((type) => calculateTypeCount(points, type));
  const formatter = (val) => `${val}x`;

  chart.height = BAR_HEIGHT * pointTypes.length;

  return new Chart(chart, getChartConfig(pointTypes, data, ChartTitle.TRANSPORT, formatter));
};

const renderTimeSpendChart = (chart, points) => {

  const pointTypes = getPointsType(points);
  const data = pointTypes.map((type) => calculateTypeDuration(points, type));

  const formatter = (val) => {
    return pointDurationFormat(val);
  };

  chart.height = BAR_HEIGHT * pointTypes.length;

  return new Chart(chart, getChartConfig(pointTypes, data, ChartTitle.TIME_SPEND, formatter));
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
  constructor(points) {
    super();

    this._points = points;
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

    this.rerender(this._points);
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const points = this._points.getPoints();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, points);
    this._transportChart = renderTransportChart(transportCtx, points);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, points);
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
