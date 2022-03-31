from os.path import exists
import math
import numpy as np
import pandas as pd
import json
from fastapi import APIRouter
from fastapi import Query
from Bot.predictions import create_lstm_model, create_train_test_set, forecast_model, normalize_data, predict, read_in_X_days, read_in_data
from sklearn.preprocessing import MinMaxScaler
import sklearn.metrics
from src.models.user import UserModel
from typing import Optional
import csv
from datetime import datetime
from binance.client import Client

client = Client()
# APIRouter creates path operations for user module
router = APIRouter(
    prefix="/coins",
    tags=["Coin"],
    responses={404: {"description": "Not found"}},
)


@router.get("/get/{coin_id}")
def get_pricing_history(coin_id: str):
    # data = client.get_historical_klines(coin_id, Client.KLINE_INTERVAL_1DAY, "1 Jan, 2022")
    # return data
    # datafile = open('Binance_BTCUSDT_1h.csv', 'r')
    file = "src/prices/" + coin_id + "USDT-1d-data.csv"
    update_pricing(coin_id)

    # data_frame = pd.read_csv(file, names=["Date", "open", "high", "low", "close"], nrows= xdays + 1)
    df = pd.read_csv(file, names=["unix", "open", "high","low", "close", "volume", "close_time", "quote_av", "trades", "tb_base", "tb_quote_av", "ignore"], index_col=False, skiprows=[0])
    # df.set_index("unix", inplace=True)
    new_df = df[["unix", "open", "high", "low", "close", "trades"]]
    data_list = []
    for row in new_df.values.tolist():
        data_list.append(row)
    return new_df.values.tolist()


@router.get("/ticker/{coin_name}")
def get_tickers(coin_name: str):
    return client.get_ticker(symbol=coin_name + 'USDT')


@router.get("/margin_info/{coin_name}")
def get_margin_info(coin_name: str):
    return client.get_margin_price_index(symbol=coin_name)


@router.get("/predict/{coin_name}")
def get_predictions(coin_name: str):

    scaler = MinMaxScaler(feature_range=(0, 1))

    lookahead = 7

    df = read_in_X_days(coin_name)
    df = df.iloc[1::]
    #df['close'] = df['close'].astype(float)

    close_list = df.reset_index()['close']

    train, test = normalize_data(scaler, close_list)
    X_train, y_train = create_train_test_set(train,lookahead)
    X_test, y_test = create_train_test_set(test,lookahead)

    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

    model = create_lstm_model()

    model.summary()
    model.load_weights("Bot/Saved_model_lstm/1-day/cp.ckpt")

    #real_movement = forecast_model(
        #df, model, scaler, close_list, X_train, y_train, X_test)
    #real_movement = real_movement.tolist()

    # Getting todays date for use in appending dates to predictions
    today = pd.to_datetime("today").normalize()
    first_date = today + pd.DateOffset(days=1)
    # Get all historical pricing data for coin
    historical_data = read_in_X_days(coin_name)
    historical_data = historical_data.iloc[::-1]
    # Get previous predictions for coin
    print("hlo")
    if exists("src/predictions/" + coin_name + "_PREDICTIONS.csv"):
        previous_predictions = pd.read_csv(
            "src/predictions/" + coin_name + "_PREDICTIONS.csv")
        difference = len(historical_data) - len(previous_predictions)
    else:
        previous_predictions = pd.DataFrame(columns=['unix', 'close'])
        difference = len(historical_data)
    # Finding difference in actual prices and predicted prices so we can calculate how many more dates we need to predict
    predictions = []
    prediction_df = pd.DataFrame(columns=['unix', 'close'])
    actual = []
    rmsepred = []
    # Predicting for new days
    for x in range(0, difference):
        # prediction = np.round(predict(historical_data.iloc[len(historical_data)-(1+x):len(historical_data)-(1+x) - 30:-1],model,scaler))
        try:
            # prediction = predict(historical_data.iloc[x:x+30],model,scaler)
            # print(len(historical_data.iloc[(len(historical_data)-1) - x:((len(historical_data)-x) - 30):-1]))
            # prediction = np.round(predict(historical_data.iloc[(len(historical_data)-1) - x:((len(historical_data)-1) -(30+x)):-1],model,scaler))
            """ prediction = predict(historical_data[x:x+30],model,scaler)
            prediction = np.insert(prediction, 0, ((int((pd.to_datetime(first_date).to_pydatetime() - pd.DateOffset(days=(x))).timestamp()) * 1000))) """
            prediction = np.round(
                predict(historical_data.iloc[x:x+7], model, scaler))
            prediction = np.insert(prediction, -1, (int((pd.to_datetime(
                first_date).to_pydatetime() - pd.DateOffset(days=x)).timestamp()) * 1000))
            """ prediction = np.insert(prediction, -1, (int((pd.to_datetime(
                today).to_pydatetime() + pd.DateOffset(days=30-x)).timestamp()) * 1000)) """
            predictions.append(prediction.tolist())
            rmsepred.append(prediction)
        except:
            next
    print(predictions)
    prediction_df = pd.DataFrame(reversed(predictions), columns=['unix', 'close'])
    if len(prediction_df) > 0:
        prediction_df = pd.concat([previous_predictions, prediction_df
                                   ], ignore_index=True)
        prediction_df.to_csv("src/predictions/" + coin_name + "_PREDICTIONS.csv", columns=['unix', 'close'], index=False)
        return prediction_df.values.tolist()  # Add filename here
    else:
        mse = sklearn.metrics.mean_squared_error(
            historical_data.values.tolist(), previous_predictions["close"].values.tolist())
        rmse = math.sqrt(mse)
        print(rmse)
        Accuracy = 1.96*rmse
        print(Accuracy)
        return previous_predictions.values.tolist()







    prediction_df = pd.concat([previous_predictions, prediction_df], ignore_index=True)
    if len(prediction_df) > 0:
        prediction_df.iloc[::-1].to_csv("src/predictions/" + coin_name +
                                        "_PREDICTIONS.csv", columns=['unix', 'close'], index=False)
    return prediction_df.values.tolist()  # Add filename here
    """ else:
        mse = sklearn.metrics.mean_squared_error(
            historical_data.values.tolist(), previous_predictions["close"].values.tolist())
        rmse = math.sqrt(mse)
        print(rmse)
        Accuracy = 1.96*rmse
        print(Accuracy)
        return previous_predictions.values.tolist()  """

    """ for x in range(0, difference):
        prediction = np.round(predict(historical_data.iloc[x:x+7], model, scaler))
        prediction = np.insert(prediction, -1, (int((pd.to_datetime(
            today).to_pydatetime() - pd.DateOffset(days=difference-x)).timestamp()) * 1000))
        rmsepred.append(prediction)
        predictions.append(prediction.tolist())
    # mse = sklearn.metrics.mean_squared_error(actual, )
    # rmse = math.sqrt(mse)
    prediction_df = pd.DataFrame(predictions, columns=['unix', 'close'])
    if len(prediction_df) > 0:
        prediction_df = pd.concat([previous_predictions, prediction_df
                                   ], ignore_index=True)
        prediction_df.to_csv("src/predictions/" + coin_name + "_PREDICTIONS.csv", columns=[
                             'unix', 'close'], index=False)
        return prediction_df.values.tolist()  # Add filename here
    else:
        mse = sklearn.metrics.mean_squared_error(
            historical_data.values.tolist(), previous_predictions["close"].values.tolist())
        rmse = math.sqrt(mse)
        print(rmse)
        Accuracy = 1.96*rmse
        print(Accuracy)
        return previous_predictions.values.tolist() """


def read_file(coiname: str):
    datafile = open('Bitstamp_BTCUSD_1h.csv', 'r')
    # datafile = open('prices.csv', 'r')
    datareader = list(csv.reader(datafile, delimiter=','))
    data = []
    for row in reversed(datareader):
        data.append(row)
    return data


def update_pricing(coin_name: str):

    df = pd.read_csv("src/prices/" + coin_name + "USDT-1d-data.csv")
    # Getting the last recorded date and getting any new data from that time
    last_date = df["unix"].iloc[-1]
    new_klines = client.get_historical_klines(
        coin_name + 'USDT', Client.KLINE_INTERVAL_1DAY, str(int(last_date) + 3600))
    if new_klines:
        new_klines = pd.DataFrame(new_klines, columns=[
                                  "unix", "open", "high", "low", "close", "volume", "close_time", "quote_av", "trades", "tb_base", "tb_quote_av", "ignore"])
        new_df = pd.concat([df, new_klines], ignore_index=True)
        new_df.to_csv("src/prices/" + coin_name +
                      "USDT-1d-data.csv", index=False)
    return


def split_dataframe(df):
    chunk_size = 7
    chunks = list()
    num_chunks = int(len(df) // chunk_size +
                     (1 if len(df) % chunk_size else 0))
    for i in range(num_chunks):
        chunks.append(df[i*chunk_size:(i+1)*chunk_size])
    return chunks
