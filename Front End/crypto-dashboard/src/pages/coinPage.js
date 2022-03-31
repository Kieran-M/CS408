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
import HC_exporting from 'highcharts/modules/exporting'

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
HC_exporting(Highcharts)

//Show reset zoom button on X axis zoom
Highcharts.removeEvent(Highcharts.Chart, "beforeShowResetZoom");

const Coin = () => {
  const Binance = require("node-binance-api");
  const binance = new Binance().options({
    //nxOzvBKAdAQKS0Lt2BP6595pddj7r3IfgchMm6o1iGy5AeI3xzlqU6Qp1IVjGM7c
    //x0zRncgRRJlTcS6Gi7Oh5CjCisuYQAHOr7xaxV2ZgoSCn0cwKb4pGeIWjr390kvp
    /* APIKEY: localStorage.getItem("apikey"),
    APISECRET: localStorage.getItem("secret"), */
    APIKEY: "nxOzvBKAdAQKS0Lt2BP6595pddj7r3IfgchMm6o1iGy5AeI3xzlqU6Qp1IVjGM7c",
    APISECRET:
      "x0zRncgRRJlTcS6Gi7Oh5CjCisuYQAHOr7xaxV2ZgoSCn0cwKb4pGeIWjr390kvp",
    //test:true,
    useServerTime: true,
    verbose: true,
    urls: {
      base: "https://testnet.binance.vision/api/",
    },
  });
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
      events: {
        addSeries(e) {
          var series = chart.chartRef.current.chart.series.map((s) => s.options);
          if (series.findIndex((s) => s.id == e.options.id)) {
            series = series.slice(0, series.length - 1);
            series.push(e.options);
            chart.onAddIndicator(series);
            return false; //having issues with return false sometimes, touchend error fires. If dont return false there are temporary duplicate indicators
          }
        },
      },
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
    //minQty = minimum order quantity
    //minNotional = minimum order value (price * quantity)
    binance.exchangeInfo(function (error, data) {
      let minimums = {};
      for (let obj of data.symbols) {
        let filters = { status: obj.status };
        for (let filter of obj.filters) {
          if (filter.filterType == "MIN_NOTIONAL") {
            filters.minNotional = filter.minNotional;
          } else if (filter.filterType == "PRICE_FILTER") {
            filters.minPrice = filter.minPrice;
            filters.maxPrice = filter.maxPrice;
            filters.tickSize = filter.tickSize;
          } else if (filter.filterType == "LOT_SIZE") {
            filters.stepSize = filter.stepSize;
            filters.minQty = filter.minQty;
            filters.maxQty = filter.maxQty;
          }
        }
        //filters.baseAssetPrecision = obj.baseAssetPrecision;
        //filters.quoteAssetPrecision = obj.quoteAssetPrecision;
        filters.orderTypes = obj.orderTypes;
        filters.icebergAllowed = obj.icebergAllowed;
        minimums[obj.symbol] = filters;
      }
      console.log(minimums);
      global.filters = minimums;
      //fs.writeFile("minimums.json", JSON.stringify(minimums, null, 4), function(err){});
    });
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
        <Spinner isLoading={isLoading} size={300}></Spinner>
      </>
    );
  }

  const updateSeries = (predictionData) => {
    setChartOptions({
      ...chartOptions,
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

  function orderHandler(type) {
    let orderurl =
      "http://127.0.0.1:8000/orders/" +
      type +
      "?coin_name=" +
      coinname +
      "&quantity=" +
      order.amount +
      "&price=" +
      order.price;
    console.log(orderurl);
    var orderConfig = {
      method: "get",
      url: orderurl,
      headers: {
        Authorization:
          "Bearer " + localStorage.getItem("_auth_state").replace(/['"]+/g, ""),
      },
    };
    axios(orderConfig)
      .then(function (response) {
        let res = response.data
        console.log(res)
        alert(res.side.toLowerCase() + " order placed for " + res.origQty.toString() + " " + res.symbol + " at $" + res.price.toString());
      })
      .catch(function (error) {
        console.log(error);
      });

    /* console.log(coinname + "USDT");
    if (type.toLowerCase() == "buy") {
      binance.buy(
        coinname + "USDT",
        order.amount,
        order.price,
        { type: "LIMIT" },
        (error, response) => {
          if (error) {
            console.log(error);
            alert(error);
          }
          console.info("Limit Buy response", response);
          console.info("order id: " + response.orderId);
        }
      );
    } else {
      binance.sell(
        coinname + "USDT",
        order.amount,
        order.price,
        { type: "LIMIT" },
        (error, response) => {
          if (error) {
            console.log(error);
            alert(error);
          }
          console.info("Limit Buy response", response);
          console.info("order id: " + response.orderId);
        }
      );
    } */
  }
  const onAddIndicator = (series) => {
    setChartOptions(...chartOptions,{series: series});
 }

  return (
    <>
      <Navbar toggle={toggle} />
      <div class="content-evenly hidden xl:grid">
        <CoinHeader coinname={coinname}></CoinHeader>
      </div>
      <div className="h-3/6 bg-gray-1000 text-gray-1000">
        <div class="flex flex-wrap overflow-hidden">
          <div class="w-full overflow-hidden md:py-5 xl:w-1/5 py-10">
            <OrderBook
              order={order}
              setOrder={setOrder}
              coin={coinname}
              isLoading={isLoading}
            />
          </div>

          <div class="w-full overflow-hidden xl:w-4/5 py-10">
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"stockChart"}
              containerProps={{ style: { height: "80vh" } }}
              options={chartOptions}
              onAddIndicator={onAddIndicator}
            />
          </div>
          <div class="w-full overflow-hidden xl:w-1/5"></div>
          <div class="w-full overflow-hidden xl:w-2/5 px-20 py-10">
            <BuyMenu
              order={order}
              setOrder={setOrder}
              orderHandler={orderHandler}
            />
          </div>
          <div class="w-full overflow-hidden xl:w-1/5 px-20 py-10">
            <button
              onClick={getPredictions}
              class="w-full shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-8 rounded"
              type="button"
            >
              Display Predictions
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Coin;
