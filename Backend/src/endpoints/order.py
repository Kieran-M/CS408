from fastapi import APIRouter, Depends, Request
from fastapi import Query
from typing import Optional
from binance import *
from binance import exceptions

from src.security import JWTBearer
from src.endpoints.login import verify_token
from src.db.mongodb import (
    retrieve_api_keys)

# APIRouter creates path operations for user module
router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
    responses={404: {"description": "Not found"}},
)


@router.get("/portfolio", dependencies=[Depends(JWTBearer())])
async def get_portfolio(token=Depends(JWTBearer())):
    client = await setup_client(token)
    info = client.get_account()
    coin_list = info["balances"]
    history = []
    for orders in coin_list:
        try:
            for order in client.get_all_orders(symbol=orders["asset"] + 'USDT'):
                history.append(order)
        except:
            next
    return {"account": info, "orders": history}


@router.get("/account", dependencies=[Depends(JWTBearer())])
async def get_account(token=Depends(JWTBearer())):
    client = await setup_client(token)
    info = client.get_account()
    return info


@router.get("/account/orders", dependencies=[Depends(JWTBearer())])
async def get_orders(token=Depends(JWTBearer())):
    orders = []
    client = await setup_client(token)
    coin_list = client.get_account()["balances"]
    for coin in coin_list:
        try:
            orders.append(client.get_all_orders(symbol=coin["asset"] + 'USDT'))
        except:
            next
    return orders


@router.get("/buy", dependencies=[Depends(JWTBearer())])
async def buy_crypto(coin_name: str, quantity: float, price: float, token=Depends(JWTBearer())):
    client = await setup_client(token)
    if(quantity <= 0):
        return "Please enter a valid amount"
    try:
        order = client.order_limit_buy(
            symbol=coin_name + "USDT",
            quantity=quantity,
            price=price)
    except exceptions.BinanceAPIException as e:
        return e.message
    return order


@router.get("/sell", dependencies=[Depends(JWTBearer())])
async def sell_crypto(coin_name: str, quantity: float, price: float, token=Depends(JWTBearer())):
    client = await setup_client(token)
    try:
        order = client.order_limit_sell(
            symbol=coin_name + "USDT",
            quantity=quantity,
            price=price)
    except exceptions.BinanceAPIException as e:
        return e.message
    return order


async def setup_client(token: str):
    decoded = verify_token(str(token))
    keys = await retrieve_api_keys(decoded["sub"]["username"])
    client = Client(api_key=str(keys["apikey"]), api_secret=str(
        keys["secretkey"]), testnet=True)
    return client
