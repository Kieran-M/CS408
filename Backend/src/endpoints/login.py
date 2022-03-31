from datetime import datetime, timedelta
import time
from typing import Optional

from fastapi import APIRouter, Depends, FastAPI, HTTPException, status, Body, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from cryptography.fernet import Fernet

from src.db.mongodb import (
    add_user,
    retrieve_user,
)
from src.models.user import (
    ErrorResponseModel,
    ResponseModel,
    UserModel,
)
router = APIRouter(
    prefix="/authenticate",
    tags=["Authenticate"],
    responses={404: {"description": "Not found"}},
)

#Secret key and algorithm used for encrypting the JWT's
SECRET_KEY = "be68f8c68cdc2926474a80c904db2044d9d32f415aa54d26174887f3379be826"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
fernet_key = b'QB3nAsQNs9VrAVos4IcZ79qUQeq_REFDuk-wU0wvswQ='
fernet = Fernet(fernet_key)
app = FastAPI()

# Verify the hash of a password


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Generate a hash for a given password


def get_hash(password):
    return pwd_context.hash(password)


# Check for user in database then check password hashes
async def authenticate_user(username: str, password: str):
    user = await retrieve_user(username)
    if not user:
        return False
    if not verify_password(password, get_hash(password)):
        return False
    return user

# Create access token for authenticated user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[
                                   ALGORITHM], options={"verify_sub": False})
        return decoded_token if decoded_token["exp"] >= time.time() else None
    except:
        return {}


# Register a new user to db
@router.post("/signup", response_description="User data added into the database successfully")
async def signup_user(user: UserModel = Body(...)):
    user.password = get_hash(user.password)
    user.apikey = fernet.encrypt(user.apikey.encode())
    user.secretkey = fernet.encrypt(user.secretkey.encode())
    user = jsonable_encoder(user)
    new_user = await add_user(user)
    if(new_user):
        return ResponseModel(new_user, "User added successfully.")
    else:
        return ErrorResponseModel("Insertion error", 400, "User already exists in database.")

# Grant a JWT to authenticated user


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": {"username": user["username"]}}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/{username}")
async def read_users_me(username):
    return await retrieve_user(username)
