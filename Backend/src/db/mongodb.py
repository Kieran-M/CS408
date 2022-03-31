import motor.motor_asyncio
import os
import pymongo
from bson.objectid import ObjectId

from cryptography.fernet import Fernet
# DB connection
client = motor.motor_asyncio.AsyncIOMotorClient(
    "mongodb+srv://admin:iQiU8teqpaFWBsRC@mosh05.9qfyz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client.crypto_dashboard
users = db.get_collection("users")

fernet_key = b'QB3nAsQNs9VrAVos4IcZ79qUQeq_REFDuk-wU0wvswQ='
fernet = Fernet(fernet_key)
# User model formatting


def user_helper(user) -> dict:
    return {
        "username": user["username"],
        "password": user["password"],
        "apikey": user["apikey"],
        "secretkey": user["secretkey"],
    }

# Add a new user into to the database


async def add_user(userdata: dict) -> dict:
    try:
        user = await users.insert_one(userdata)
    except:
        return False
    new_user = await users.find_one({"_id": user.inserted_id})
    return user_helper(new_user)


# Retrieve a user with a matching ID
async def retrieve_user(id: str) -> dict:
    user = await users.find_one({"username": id})
    if user:
        print(user)
        return user_helper(user)

async def retrieve_api_keys(id: str) -> dict:
    user = await users.find_one({"username": id})
    if user:
        keys = {"apikey": fernet.decrypt(user["apikey"].encode()).decode() , "secretkey" : fernet.decrypt(user["secretkey"].encode()).decode()}
        return keys
