import React, { useEffect, useState } from "react";

const CoinHeader = (props) => {
  const Binance = require("node-binance-api");
  const binance = new Binance();
  const [data, setData] = useState({lastPrice: 0, highPrice: 0, lowPrice: 0, priceChangePercent: 0});
  const getCoinData = () => {
    binance.prevDay(props.coinname + "USDT", (error, prevDay, symbol) => {
      console.log(prevDay);
      setData(prevDay);
    });
  };
  useEffect(() => {
    getCoinData();
    const interval = setInterval(() => {
      getCoinData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div class="grid grid-flow-col auto-cols-max gap-4 mt-10">
      <h1 class="font-medium leading-tight text-2xl mt-0 ml-10 text-blue-600 col-span-1">
        {props.coinname} /USD
      </h1>
      <ul class="flex ml-10">
        <li class="mr-5">
          <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-blue-600 col-span-1">
            CURRENT PRICE : ${parseFloat(data.lastPrice)}
          </h1>
        </li>
        <div class="block">
          <li class="mr-5">
            <p class="font-medium leading-tight text-2xl mt-0 mb-2 text-blue-600 col-span-1">
              24H HIGH : ${parseFloat(data.highPrice)}
            </p>
          </li>
        </div>
        <li class="mr-5">
          <p class="font-medium leading-tight text-2xl mt-0 mb-2 text-blue-600 col-span-1">
            24H LOW : ${parseFloat(data.lowPrice)}
          </p>
        </li>
        <li class="mr-5">
          <p class="font-medium leading-tight text-2xl mt-0 mb-2 text-blue-600 col-span-1">
            PRICE CHANGE : {parseFloat(data.priceChangePercent)} %
          </p>
        </li>
      </ul>
    </div>
  );
};

export default CoinHeader;
