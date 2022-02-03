import React from "react";

const BuyMenu = (props) => {
  return (
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
            value={props.order.amount}
            onChange={(e) => {
              props.setOrder({
                amount: e.target.value,
                price: props.order.price,
              });
            }}
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
            value={props.order.price}
            onChange={(e) => {
              props.setOrder({
                amount: props.order.amount,
                price: e.target.value,
              });
            }}
          ></input>
        </div>
      </div>
      <div class="md:flex md:items-center">
        <div class="md:w-1/3"></div>
        <div class="md:w-2/3">
          <div class="flex items-center justify-between">
            <button
              onClick={() => props.orderHandler("buy")}
              class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-8 rounded"
              type="button"
            >
              Buy
            </button>
            <button
              onClick={() => props.orderHandler("sell")}
              class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-8 rounded"
              type="button"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default BuyMenu;
