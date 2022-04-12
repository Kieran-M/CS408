from fastapi.testclient import TestClient

from main import app

from binance.client import Client

client = TestClient(app)
binance_client = Client()

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == ["Hello World"]

def test_get_pricing():
    response = client.get("/coins/get/BTC")
    assert response.status_code == 200
    print(response)

def test_get_predictions():
    response = client.get("/coins/predict/BTC")
    assert response.status_code == 200
    print(response)

def test_valid_buy():
    token = client.post("account/login")
    response = client.get("/order/buy")
    assert response.status_code == 200