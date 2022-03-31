import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar/navbar";
import BuyMenu from "../components/buyMenu";

import "./coinPage.css";

import axios from "axios";

import Spinner from "../components/Spinner";

import OrderBook from "../components/orderBook";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
import Heikinashi from "highcharts/modules/heikinashi.js";
import HollowCandlestick from "highcharts/modules/hollowcandlestick.js";
import AO from "highcharts/indicators/ao.js";
import MFI from "highcharts/indicators/mfi.js";
import CoinHeader from "../components/coinHeader";

Indicators(Highcharts);
DragPanes(Highcharts);
AnnotationsAdvanced(Highcharts);
PriceIndicator(Highcharts);
FullScreen(Highcharts);
StockTools(Highcharts);
Heikinashi(Highcharts);
HollowCandlestick(Highcharts);
AO(Highcharts);
MFI(Highcharts);

//Show reset zoom button on X axis zoom
Highcharts.removeEvent(Highcharts.Chart, "beforeShowResetZoom");

const HighchartsGraph = () => {

  let chart;
  const { coinname } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [volume, setVolume] = useState(null);
  const [predict, setPredict] = useState(null);
  const [order, setOrder] = useState({ amount: 0, price: 0 });
  const [chartOptions, setChartOptions] = useState({
    tooltip: {
      split: true,
      crosshairs: true,
      followPointer: true,
    },
    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Price",
        },
        height: "80%",
        lineWidth: 2,
      },
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Volume",
        },
        top: "90%",
        height: "10%",
        offset: 1,
        lineWidth: 2,
      },
    ],
    xAxis: [
      {
        ordinal: false,
      },
    ],
    title: {
      text: coinname,
    },
    chart: {
      height: 600,
      style: {
        cursor: "crosshair",
      },
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    rangeSelector: {
      buttons: [
        {
          type: "day",
          count: 3,
          text: "3d",
        },
        {
          type: "week",
          count: 1,
          text: "1w",
        },
        {
          type: "month",
          count: 1,
          text: "1m",
        },
        {
          type: "year",
          count: 1,
          text: "1y",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      selected: 3,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 1000,
          },
          chartOptions: {
            rangeSelector: {
              inputEnabled: false,
            },
          },
        },
      ],
    },
  });
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/coins/get/" + coinname.toUpperCase())
      .then((res) => {
        const candlestickData = res.data.map((tick) => {
          return [
            parseInt(tick[0]),
            parseFloat(tick[1]),
            parseFloat(tick[2]),
            parseFloat(tick[3]),
            parseFloat(tick[4]),
          ];
        });
        const volume = res.data.map((tick) => {
          return [parseInt(tick[0]), parseInt(tick[5])];
        });
        setVolume(volume);
        setData(candlestickData);
        setChartOptions({
          yAxis: [
            {
              labels: {
                align: "right",
                x: -3,
              },
              title: {
                text: "Price",
              },
              height: "80%",
              lineWidth: 2,
            },
            {
              labels: {
                align: "right",
                x: -3,
              },
              title: {
                text: "Volume",
              },
              top: "90%",
              height: "10%",
              offset: 1,
              lineWidth: 2,
            },
          ],
          series: [
            {
              name: coinname,
              id: coinname,
              type: "candlestick",
              data: candlestickData,
            },
            {
              name: "Volume",
              id: "volume",
              type: "column",
              data: volume,
              yAxis: 1,
            },
          ],
        });

        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => console.log(error));
  }, []);

  //While data is still being fetched display loading spinner
  if (isLoading) {
    return (
      <>
        <Navbar />
        <Spinner isLoading={isLoading}></Spinner>
      </>
    );
  }

  const updateSeries = (predictionData) => {
    setChartOptions({
      series: [
        {
          name: coinname,
          id: coinname,
          type: "candlestick",
          data: data,
        },
        {
          name: "Volume",
          id: "volume",
          type: "column",
          data: volume,
          yAxis: 1,
        },
        {
          name: "Prediction",
          id: "Prediction",
          data: predictionData,
          color: "green",
        },
      ],
    });
  };

  function getPredictions() {
    axios
      .get("http://127.0.0.1:8000/coins/predict/" + coinname)
      .then((res) => {
        console.log(res);
        let predictionData = res.data.map((tick) => {
          return [parseInt(tick[0]), parseFloat(tick[1])];
        });
        setPredict(predictionData);
        updateSeries(predictionData);
        console.log(predictionData[0]);
      })
      .catch((error) => console.log(error));
  }

  
  return (
    <>

            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"stockChart"}
              containerProps={{ style: { height: "80vh" } }}
              options={chartOptions}
            />
    </>
  );
};

export default HighchartsGraph;
