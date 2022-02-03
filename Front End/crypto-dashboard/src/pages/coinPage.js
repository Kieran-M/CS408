import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar";
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

Indicators(Highcharts);
DragPanes(Highcharts);
AnnotationsAdvanced(Highcharts);
PriceIndicator(Highcharts);
FullScreen(Highcharts);
StockTools(Highcharts);
Heikinashi(Highcharts);
HollowCandlestick(Highcharts);

//Show reset zoom button on X axis zoom
Highcharts.removeEvent(Highcharts.Chart, "beforeShowResetZoom");

const Coin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [order, setOrder] = useState({ amount: 0, price: 0 });

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const { coinname } = useParams();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/coins/" + coinname.toUpperCase() + "USDT")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  //While data is still being fetched display loading spinner
  if (isLoading) {
    return (
      <>
        <Navbar/>
        <Spinner isLoading={isLoading}></Spinner>
      </>
    );
  }

  //Parsing candlestick data into a readable format for highcharts
  const candlestickData = data.map((tick) => {
    return [
      Date.parse(tick[0]),
      parseInt(tick[1]),
      parseInt(tick[2]),
      parseInt(tick[3]),
      parseInt(tick[4]),
    ];
  });

  //Configure options for highcharts
  const options = {
    yAxis: [
      {
        crosshair: {
          label: {
            enabled: true,
          },
        },
        height: "100%",
        resize: {
          enabled: true,
        },
      },
      {
        top: "80%",
        height: "20%",
        offset: 0,
      },
    ],
    tooltip: {
      crosshairs: true,
      followPointer: true,
    },
    series: [
      {
        name: coinname,
        id: coinname,
        type: "candlestick",
        data: candlestickData,
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
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 800,
          },
          chartOptions: {
            rangeSelector: {
              inputEnabled: false,
            },
          },
        },
      ],
    },
  };

  function orderHandler(type) {
    axios
      .get(
        "http://127.0.0.1:8000/" +
          type +
          "?coin_name=" +
          coinname +
          "&quantity=" +
          order.amount +
          "&price=" +
          order.price
      )
      .then(function (response) {
        alert(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
      <Navbar toggle={toggle} />
      <div className="min-h-screen bg-gray-100 text-gray-1000">
        <div class="grid grid-cols-5 h-auto">
          <div class="col-span-1">
            <OrderBook
              order={order}
              setOrder={setOrder}
              coin={coinname}
              isLoading={isLoading}
            />
          </div>
          <div class="col-span-4">
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"stockChart"}
              containerProps={{ style: { height: "100%" } }}
              options={options}
            />
          </div>
        </div>
        <div class="grid my-5 grid-cols-1 h-100">
          <div id="col-span-1 h-full">
            <BuyMenu
              order={order}
              setOrder={setOrder}
              orderHandler={orderHandler}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Coin;
