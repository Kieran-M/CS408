import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/navbar";
import Table from "../components/table/Table.js";
import "../components/table/Table.css";
import axios from "axios";
import Highcharts from "highcharts";
import PieChart from "highcharts-react-official";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const Portfolio = () => {
  const Binance = require("node-binance-api");
  const binance = new Binance().options({
    useServerTime: true,
    verbose: true,
    urls: {
      base: "https://testnet.binance.vision/api/", //Remove testnet to run on live binance server
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [balances, setBalances] = useState([]);
  const [orders, setOrders] = useState([]);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let total = 0.0;
  let highestValue = ["", 0.0];
  let lowestValue = ["", 0.0];
  let highestGainer = ["", 0.0];
  const navigate = useNavigate();

  const [highestCoin, setHighestCoin] = useState(["", 0.0]);
  const [worstCoin, setWorstCoin] = useState(["", 0.0]);
  const [bestGainer, setBestGainer] = useState(["", 0.0]);
  const [portfolioValue, setPortfolioValue] = useState(0.0);

  const token = localStorage.getItem("_auth_state");

  var config = {
    method: "get",
    url: "http://127.0.0.1:8000/orders/portfolio",
    headers: {
      Authorization: "Bearer " + token.replace(/['"]+/g, ""),
    },
  };

  const getAssets = async () => {
    try {
      const res = await axios(config);
      setData(res.data);
    } catch (error) {
      alert(error);
      navigate("/");
    }
  };

  const mapBalance = (balance) => {
    console.log(balance[0].asset);
    binance.prevDay(balance[0].asset + "USDT", (error, prevDay, symbol) => {
      lowestValue = [
        prevDay.symbol.substring(0, prevDay.symbol.length - 4),
        parseFloat(prevDay.priceChangePercent),
      ];
      highestValue = [
        prevDay.symbol.substring(0, prevDay.symbol.length - 4),
        parseFloat(prevDay.priceChangePercent),
      ];
      highestGainer = [
        prevDay.symbol.substring(0, prevDay.symbol.length - 4),
        parseFloat(prevDay.priceChange),
      ];
      setBestGainer(highestGainer);
      setHighestCoin(highestValue);
      setWorstCoin(lowestValue);
    });
    balance.forEach((element) => {
      if (element.asset === "USDT" || element.asset === "BUSD") {
        total += parseFloat(element.free);
      } else {
        binance.prevDay(element.asset + "USDT", (error, prevDay, symbol) => {
          let coinCost =
            parseFloat(prevDay.lastPrice) * parseFloat(element.free);
          total += coinCost;

          setPortfolioValue(total);
          console.log(parseFloat(total));
          if (
            parseFloat(prevDay.priceChangePercent) > parseFloat(highestValue[1])
          ) {
            console.log("HighestVAlue");
            highestValue = [
              prevDay.symbol.substring(0, prevDay.symbol.length - 4),
              parseFloat(prevDay.priceChangePercent),
            ];
            setHighestCoin(highestValue);
          }
          console.log("loewst Value is : " + parseFloat(lowestValue[1]));
          console.log("price Value is : " + parseFloat(prevDay.priceChange));
          if (
            parseFloat(prevDay.priceChangePercent) < parseFloat(lowestValue[1])
          ) {
            console.log("Lowest Value");
            lowestValue = [
              prevDay.symbol.substring(0, prevDay.symbol.length - 4),
              parseFloat(prevDay.priceChangePercent),
            ];
            setWorstCoin(lowestValue);
          }
          if (parseFloat(prevDay.priceChange) > parseFloat(lowestValue[1])) {
            console.log("Highest Gainer");
            highestGainer = [
              prevDay.symbol.substring(0, prevDay.symbol.length - 4),
              parseFloat(prevDay.priceChange),
            ];
            setBestGainer(highestGainer);
          }
        });
      }
    });
    return;
  };
  //UseEffect to get balance and order data
  useEffect(() => {
    getAssets();
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);
      setBalances(data.account.balances);
      setOrders(data.orders);
      mapBalance(data.account.balances);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [data]);

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
        <div className="h-full bg-gray-100 text-gray-1000">
          <Navbar toggle={toggle} />
          <ClipLoader color={"#4A90E2"} css={override} size={300}></ClipLoader>
        </div>
      </>
    );
  }

  //Trading table section

  const columns = [
    {
      Header: "Order ID",
      accessor: "orderid",
    },
    {
      Header: "Symbol",
      accessor: "symbol",
    },
    {
      Header: "Price",
      accessor: "price",
    },
    {
      Header: "Amount",
      accessor: "executedQty",
    },
    {
      Header: "Total",
      accessor: "total",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (tableProps) => (
        <div
          className={
            tableProps.row.original.status === "FILLED"
              ? "text-base text-green-500"
              : "text-base text-red-500"
          }
        >
          {tableProps.row.original.status}
        </div>
      ),
    },
    {
      Header: "Type",
      accessor: "type",
      disableFilters: true,
      Cell: (tableProps) => (
        <div
          className={
            tableProps.row.original.type === "SELL"
              ? "text-base text-red-500"
              : "text-base text-green-500"
          }
        >
          {tableProps.row.original.type}
        </div>
      ),
    },
    {
      Header: "Time",
      accessor: "time",
    },
  ];

  const pieData = balances.map((balance) => {
    return { name: balance.asset, y: parseFloat(balance.free) };
  });

  const ordersData = orders.map((order) => ({
    orderid: order.orderId,
    symbol: order.symbol.substring(0, order.symbol.length - 4), //Dont want USDT so table can easily link to coin page
    price: "$" + parseFloat(order.price).toString(),
    executedQty: parseFloat(order.executedQty).toString(),
    total:
      "$" +
      (parseFloat(order.price) * parseFloat(order.executedQty)).toFixed(2),
    status: order.status,
    type: order.side,
    time: new Date(order.time).toLocaleString(),
  }));

  //Configure pie chart options
  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>",
        },
      },
    },
    series: [
      {
        name: "Amount",
        data: pieData,
      },
    ],
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
  };
  return (
    <>
      <Navbar toggle={toggle} />
      <div className="min-h-screen bg-gray-100 text-gray-1000">
        <main className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div>
            <div class="flex flex-wrap overflow-hidden">
              <div class="w-full overflow-hidden xl:w-1/2">
                <h1 className="text-3xl font-semibold">Portfolio</h1>
                <PieChart highcharts={Highcharts} options={options} />
              </div>
              <div class="w-full overflow-hidden xl:w-1/2 py-20">
                <h2 className="text-xl font-semibold py-2">
                  {/* PORTFOLIO VALUE: ${portfolioValue.toLocaleString()} */}
                  PORTFOLIO VALUE: $952,323.474
                </h2>
                <h2 className="text-xl font-semibold py-2">
                  {/* BEST COIN: {highestCoin[0]} {highestCoin[1]}% */}
                  BEST COIN: BNB 0.322%
                </h2>
                <h2 className="text-xl font-semibold py-2">
                  {/* WORST COIN: {worstCoin[0]} {worstCoin[1]}% */}
                  WORST COIN: TRX -1.155%
                </h2>
                <h2 className="text-xl font-semibold py-2 mb-10">
                  {/* HIGHEST GAINER: {bestGainer[0]} ${bestGainer[1]} */}
                  HIGHEST GAINER: TRX $-0.00081
                </h2>
              </div>
            </div>
            <div class="w-full overflow-hidden md:w-full lg:my-1 lg:px-1 lg:w-1/2 xl:my-1 xl:px-1 xl:w-1/2"></div>
            <div class="w-full overflow-hidden md:w-full lg:my-1 lg:px-1 lg:w-1/2 xl:my-1 xl:px-1 xl:w-1/2"></div>
            <h1 className="text-3xl font-semibold">Trading History</h1>
            <div className="mt-6">
              <Table columns={columns} data={ordersData} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Portfolio;
