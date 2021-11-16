import React, { useState, useEffect } from "react";

import axios from "axios";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Table from "../components/table/Table";

import "../components/table/Table.css";

const Market = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const [coin, setCoins] = useState([]);

  const getCoins = async () => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      )
      .then((res) => {
        setCoins(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getCoins();

    const interval = setInterval(() => {
      getCoins();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "image",
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
      },
      {
        Header: "Market Cap",
        accessor: "market_cap",
      },
      {
        Header: "Price",
        accessor: "price_change_percentage_24h",
        Cell: (tableProps) => (
          <div
            className={
              tableProps.row.original.price_change_percentage_24h < 0
                ? "text-sm text-red-500"
                : "text-sm text-green-500"
            }
          >
            {tableProps.row.original.price_change_percentage_24h}
          </div>
        ),
      },
      {
        Header: "Volume",
        accessor: "total_volume",
      },
    ],
    []
  );

  const data = React.useMemo(() =>
    coin.map((coin) => {
      return {
        key: coin.id,
        image: coin.image,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        current_price: "$" + coin.current_price,
        market_cap: "$" + coin.market_cap,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        total_volume: "$" + coin.total_volume,
      };
    })
  );

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <div className="min-h-screen bg-gray-100 text-gray-1000">
        <main className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="">
            <h1 className="text-xl font-semibold">Market</h1>
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
