import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import time
import numpy
import tensorflow as tf
from tensorflow.keras.wrappers.scikit_learn import KerasRegressor
from sklearn.metrics import fbeta_score, make_scorer
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import LSTM


def read_in_data():
    """
    Reads in our collected BTC csv into a pandas data frame and removes all other columns other than the close price

    :param - 
    :returns - Pandas data frame containing the close price indexed by time
    """

    data_frame = pd.DataFrame()
    file = "Binance_BTCUSDT_d.csv"
    data_frame = pd.read_csv(file, names=[
                             "Date", "open", "high", "low", "close"])
    data_frame.set_index("Date", inplace=True)
    data_frame = data_frame[["close"]]
    return data_frame


def read_in_X_days(coin_name):
    #file = "BTCUSDT_1h.csv"
    file = "src/prices/" + coin_name + "USDT-1d-data.csv"
    #data_frame = pd.read_csv(file, names=["Date", "open", "high", "low", "close"], nrows= xdays + 1)
    #data_frame = pd.read_csv(file, names=["unix","date","symbol","open","high","low","close","Volume BTC","Volume USDT","tradecount"], nrows= xdays + 1)
    data_frame = pd.read_csv(file, names=["unix", "open", "high",
                     "low", "close", "volume" "close_time", "quote_av", "trades", "tb_base", "tb_quote_av","ignore"],index_col=False, skiprows=[0])
    data_frame.set_index("unix", inplace=True)
    data_frame = data_frame[["close"]]
    #data_frame.iloc[::-1]
    closelist = data_frame["close"]
    #closelist = closelist[1:]
    return closelist


def normalize_data(scaler, close_list):
    """
    This section takes in our value lists and scales them using a minmaxscaler within the range 0,1 and reshapes our data.
    We then seperate our data into training and testing sets to a 80:20 split to be used to train and evaluate our model

    :param - scaler, close_list
    :returns - train, test
    """

    close_list = scaler.fit_transform(np.array(close_list).reshape(-1, 1))

    train_split = int(len(close_list)*0.80)
    train = close_list[0:train_split]
    test = close_list[train_split:len(close_list)]

    return train, test


def create_train_test_set(data, lookahead):
    """
    This method takes in either our train or test set and creates a time lag of the predefined lookahead value
    It then returns the X and Y list where Y contains the time lagged data

    :param - data, lookahead
    :returns - X_train, X_test, y_train, y_test
    """

    X = list()
    Y = list()

    length = len(data)
    for i in range(length-lookahead-1):
        X.append(data[i:(i+lookahead)])
        Y.append(data[i + lookahead])
    return numpy.array(X), numpy.array(Y)


def create_lstm_model():
    """
    This method defines the general structure for the regressor that is passed into grid search

    :param - 
    :returns - model
    """
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(7, 1)))
    model.add(LSTM(50, return_sequences=True))
    model.add(LSTM(50))
    model.add(Dense(1))
    model.compile(loss='mean_squared_error', optimizer='adam')

    return model

def predict(list_values,model,scaler): 
    df = pd.DataFrame (list_values, columns = ['close']) 
    close = df.reset_index()['close'] 
    close = scaler.fit_transform(np.array(close).reshape(-1, 1)) 
    close = numpy.array([close]) 
    prediction = model.predict(close) 
    prediction = scaler.inverse_transform(prediction) 
    return prediction


def forecast_model(df, model, scaler, close_list, X_train, y_train, X_test):
    """
    In this method we forecast using our model and the test data set
    We then plot the inverse scaled values onto a graph with the real BTC price

    :param - X_train, y_train, X_test, y_test
    :returns - model
    """

    train_predict = model.predict(X_train)
    test_predict = model.predict(X_test)
    train_predict = scaler.inverse_transform(train_predict)
    test_predict = scaler.inverse_transform(test_predict)

    forecast_movement = np.concatenate((train_predict, test_predict))
    real_movement = df[["close"]][:288].values

    return forecast_movement
