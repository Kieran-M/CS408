from fastapi import APIRouter
from src.endpoints import user,coin,order,login

router = APIRouter()
router.include_router(user.router)
router.include_router(coin.router)
router.include_router(order.router)
router.include_router(login.router)