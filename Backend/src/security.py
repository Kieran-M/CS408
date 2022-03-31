from passlib.context import CryptContext

import bcrypt

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.endpoints.login import verify_token, SECRET_KEY, ALGORITHM


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=403, detail="Invalid authentication scheme.")
            if not self.decode_token(str(credentials.credentials)):
                raise HTTPException(
                    status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(
                status_code=403, detail="Invalid authorization code.")

    def decode_token(self, jwtoken: str) -> bool:
        isTokenValid: bool = False
        payload = verify_token(str(jwtoken))
        if payload:
            isTokenValid = True
        return isTokenValid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Hasher():
    @staticmethod
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password):
        return pwd_context.hash(password)
        
apikey_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_salt():
    return bcrypt.gensalt().decode()


def verify_key(plain_apikey, hashed_apikey):
    return apikey_context.verify(plain_apikey, hashed_apikey)


def get_key_hash(apikey):
    return apikey_context.hash(apikey)
