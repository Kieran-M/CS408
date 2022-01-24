import csv
from typing import Optional
from binance import exceptions

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from binance import *
import requests

client = Client("nxOzvBKAdAQKS0Lt2BP6595pddj7r3IfgchMm6o1iGy5AeI3xzlqU6Qp1IVjGM7c",
                "x0zRncgRRJlTcS6Gi7Oh5CjCisuYQAHOr7xaxV2ZgoSCn0cwKb4pGeIWjr390kvp", testnet=True)
app = FastAPI()


origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/coins/{coin_id}")
def get_pricing_history(coin_id: str):
    #data = client.get_historical_klines(coin_id, Client.KLINE_INTERVAL_1DAY, "1 Jan, 2022")
    #return data
    datafile = open('prices.csv', 'r')
    datareader = list(csv.reader(datafile, delimiter=','))
    data = []
    for row in reversed(datareader):
        data.append(row)

    return data


@app.get("/account/")
def get_account_info():
    return client.get_account()


@app.get("account/trades")
def get_trades(coin_name: str,):
    trades = client.get_my_trades(symbol=coin_name + 'USDT')
    return trades


@app.get("/account/orders")
def get_orders(coin_name: str, limit: int):
    orders = client.get_all_orders(symbol=coin_name + 'USDT', limit=limit)
    return orders


@app.get("/buy")
def buy_crypto(coin_name: str, quantity: float, price: float):
    try:
        order = client.order_limit_buy(
            symbol=coin_name + "USDT",
            quantity=quantity,
            price=price)
    except exceptions.BinanceAPIException as e:
        return e.message
    return order

@app.get("/sell")
def buy_crypto(coin_name: str, quantity: float, price: float):
    try:
        order = client.order_limit_sell(
            symbol=coin_name + "USDT",
            quantity=quantity,
            price=price)
    except exceptions.BinanceAPIException as e:
        return e.message
    return order

# Maybe dont need this anymore
@app.get("/market/sparklines")
def get_sparklines():
    sparklines = requests.get(
        "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true")
    return sparklines.json()["market_data"]["sparkline_7d"]["price"]


@app.get("/withdraw")
def sell_crypto(coin_name: str, quantity: int, address: str):
    try:
        order = client.withdraw(
            coin=coin_name,
            address=address,
            amount=quantity,
            name='Withdraw')
    except exceptions.BinanceAPIException as e:
        return e.message
    return order
