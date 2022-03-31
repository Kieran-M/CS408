import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";

const OrderBook = (props) => {
  const [orders, setOrders] = useState([]);
  const currencyPair = props.coin.toLowerCase() + "usdt";

  const currencyArray = currencyPair.toUpperCase().match(/.{1,3}/g);

  useEffect(() => {
    const subscribe = {
      method: "SUBSCRIBE",
      params: [currencyPair + "@depth10@1000ms"],
      id: 1,
    };
    const ws = new WebSocket("wss://stream.binance.com:9443/ws");
    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log(response);
      setOrders(response);
    };
    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, [currencyPair]);

  const { bids, asks } = orders;
  const orderRows = (arr, str) =>
    arr &&
    arr.map((item, index) => (
      <tr
        className="table-auto hover:bg-gray-200"
        style={{ cursor: "pointer" }}
        key={index}
        onClick={() => {
          props.setOrder({ amount: item[1], price: item[0] });
        }}
      >
        <td className="text-base"> {item[1]} </td>
        <td
          className="text-base"
          style={{ color: str === "bids" ? "#0c0" : "#c00" }}
        >
          {" "}
          {item[0]}
        </td>
      </tr>
    ));
  const orderHead = (title) => (
    <thead>
      <tr>
        <th className="text-lg" colSpan="2">
          {title}
        </th>
      </tr>
      <tr>
        <th className="text-lg">Amount ({currencyArray[0]})</th>
        <th className="text-lg">Price ({currencyArray[1]})</th>
      </tr>
    </thead>
  );
  return (
    <>
      {orders.length === 0 || orders.id === 1 ? (
                <Spinner isLoading={orders.length === 0} size={150}></Spinner>
      ) : (
        <div className="order-container">
          <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full text-center font-weight: 500">
                    {orderHead("Bids")}
                    <tbody>{orderRows(bids, "bids")}</tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full text-center">
                    {orderHead("Asks")}
                    <tbody>{orderRows(asks, "asks")}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderBook;
