import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import "./coinPage.css";

import axios from "axios";

import { css } from "@emotion/react";

import ClipLoader from "react-spinners/ClipLoader";

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

const Coin = ({ match, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [buyAmount, setBuyAmount] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const { coinname } = useParams();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/coins/" + coinname.toUpperCase() + "USDT")
      .then((res) => {
        console.log(res.data);
        console.log(...res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  //Override css for spinner
  const override = css`
    display: block;
    margin-top: 500;
    margin: 0 auto;
    margin-top: 200px;
  `;

  //While data is still being fetched display loading spinner
  if (isLoading) {
    return (
      <>
        <Sidebar isOpen={isOpen} toggle={toggle} />
        <Navbar toggle={toggle} />
        <ClipLoader color={"#4A90E2"} css={override} size={300}></ClipLoader>
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

  //Send buy and sell requests to backend
  const handleBuy = () => {
    axios
      .get(
        "http://127.0.0.1:8000/buy?coin_name=" +
          coinname +
          "&quantity=" +
          buyAmount +
          "&price=" +
          buyPrice
      )
      .then(function (response) {
        alert(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSell = () => {
    axios
      .get(
        "http://127.0.0.1:8000/sell?coin_name=" +
          coinname +
          "&quantity=" +
          buyAmount +
          "&price=" +
          buyPrice
      )
      .then(function (response) {
        alert(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <div id="chart-container">
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          containerProps={{ style: { height: "100%" } }}
          options={options}
        />
      </div>
      <div id="buy-menu">
        <form class="w-full max-w-sm">
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-amount"
              >
                Amount
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                id="inline-amount"
                type="number"
                value={buyAmount}
                onChange={(event) => setBuyAmount(event.target.value)}
              ></input>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-price"
              >
                Price
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                id="inline-price"
                type="number"
                value={buyPrice}
                onChange={(event) => setBuyPrice(event.target.value)}
              ></input>
            </div>
          </div>
          <div class="md:flex md:items-center">
            <div class="md:w-1/3"></div>
            <div class="md:w-2/3">
              <div class="flex items-center justify-between">
                <button
                  onClick={handleBuy}
                  class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-8 rounded"
                  type="button"
                >
                  Buy
                </button>
                <button
                  onClick={handleSell}
                  class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-8 rounded"
                  type="button"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Coin;
