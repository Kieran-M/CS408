from fastapi import APIRouter, Body, Depends
from fastapi import Query
from src.models.user import UserModel
from typing import Optional
from binance import *



#APIRouter creates path operations for user module
router = APIRouter(
    prefix="/account",
    tags=["Account"],
    responses={404: {"description": "Not found"}},
)

client = Client("nxOzvBKAdAQKS0Lt2BP6595pddj7r3IfgchMm6o1iGy5AeI3xzlqU6Qp1IVjGM7c",
                "x0zRncgRRJlTcS6Gi7Oh5CjCisuYQAHOr7xaxV2ZgoSCn0cwKb4pGeIWjr390kvp", testnet=True)

@router.get("/")
def get_account_info():
    return client.get_account()