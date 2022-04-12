import React, { useState, useEffect } from "react";

import axios from "axios";

import Navbar from "../components/navbar/navbar";
import Table from "../components/table/Table";

import { Sparklines, SparklinesLine } from "react-sparklines";

import "../components/table/Table.css";

const Market = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  //State containing coin list
  const [coin, setCoins] = useState([]);

  const getCoins = async () => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=100&page=1&sparkline=true"
      )
      .then((res) => {
        setCoins(res.data);
      })
      .catch((error) => console.log(error));
  };

  //This useEffect is called every 10 seconds to refresh coin data. By changing the interval time this can be decreased to update data faster.
  useEffect(() => {
    getCoins();

    const interval = setInterval(() => {
      getCoins();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  //Column list for coin table that is passed to table component
  const columns = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "image",
        disableFilters: true,
        disableSortBy: true,
        Cell: (tableProps) => (
          <img
            src={tableProps.row.original.image}
            width={60}
            alt="Coin Image"
          />
        ),
      },
      {
        Header: "Title",
        accessor: "name",
      },
      {
        Header: "Symbol",
        accessor: "symbol",
      },
      {
        Header: "Current Price",
        accessor: "current_price",
        disableFilters: true,
      },
      {
        Header: "Market Cap",
        accessor: "market_cap",
        disableFilters: true,
      },
      {
        Header: "Price Change % (24h)",
        accessor: "price_change_percentage_24h",
        disableFilters: true,
        Cell: (tableProps) => (
          <div
            className={
              tableProps.row.original.price_change_percentage_24h < 0
                ? "text-base text-red-500"
                : "text-base text-green-500"
            }
          >
            {tableProps.row.original.price_change_percentage_24h} %
          </div>
        ),
      },
      {
        Header: "Volume",
        accessor: "total_volume",
        disableFilters: true,
      },
      {
        Header: "Last 7 Days",
        accessor: "x_days",
        disableFilters: true,
        disableSortBy: true,
        Cell: (tableProps) => (
          <Sparklines
            data={tableProps.row.original.x_days}
          >
            <SparklinesLine
              color={
                tableProps.row.original.x_days[0] <
                tableProps.row.original.x_days.reverse()[0]
                  ? "red"
                  : "green"
              }
              style={{ fill: "none" }}
            />
          </Sparklines>
        ),
      },
    ],
    []
  );

  //Mapping coin data into a format useable by the table component
  const data = React.useMemo(() =>
    coin.map((coin) => {
        return {
          key: coin.id,
          image: coin.image,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          current_price: "$" + coin.current_price.toString(),
          market_cap: "$" + coin.market_cap.toLocaleString(),
          price_change_percentage_24h:
            coin.price_change_percentage_24h.toLocaleString(),
          total_volume: "$" + coin.total_volume.toLocaleString(),
          x_days: coin.sparkline_in_7d.price,
        };
    })
  ); 
  
  return (
    <>
      <Navbar toggle={toggle} />
      <div className="min-h-screen bg-gray-100 text-gray-1000">
        <main className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="">
            <h1 className="text-3xl font-semibold">Market</h1>
          </div>
          <div className="mt-6">
            <Table columns={columns} data={data} />
          </div>
        </main>
      </div>
    </>
  );
};

export default Market;
