from importlib import reload
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from src.routes.api import router as api_router

from fastapi import FastAPI
from pydantic import BaseModel
import jwt
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

SECERT_KEY = "be68f8c68cdc2926474a80c904db2044d9d32f415aa54d26174887f3379be826"
ALGORITHM ="HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 30

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

app.include_router(api_router)

class LoginItem(BaseModel):
    username: str
    password: str

    @app.get("/")
    def read_root():
     return {"Hello World"}

if __name__ == '__main__':
    uvicorn.run("main:app", host='127.0.0.1', port=8005, log_level="info", reload=True)
    print("running")


