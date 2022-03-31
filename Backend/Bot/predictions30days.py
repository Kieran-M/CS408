import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import time
import numpy
import math
import tensorflow as tf
from tensorflow.keras.wrappers.scikit_learn import KerasRegressor
from sklearn.metrics import fbeta_score, make_scorer
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.layers import LSTM
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import MeanSquaredError
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.preprocessing.sequence import TimeseriesGenerator


def read_in_data():
    """
    Reads in our collected BTC csv into a pandas data frame and removes all other columns other than the close price
    
    :param - 
    :returns - Pandas data frame containing the close price indexed by time
    """
    
    data_frame = pd.DataFrame()
    file = "src/prices/BTCUSDT-1d-data.csv"
    data_frame = pd.read_csv(file, names=["unix", "open", "high","low", "close", "volume", "close_time", "quote_av", "trades", "tb_base", "tb_quote_av","ignore"],index_col=False, skiprows=[0])
    data_frame.set_index("unix", inplace = True)
    data_frame = data_frame[["close"]]     
    return data_frame

def read_in_X_days(coin_name):
    #file = "BTCUSDT_1h.csv"
    file = "src/prices/" + coin_name + "USDT-1d-data.csv"
    #data_frame = pd.read_csv(file, names=["Date", "open", "high", "low", "close"], nrows= xdays + 1)
    #data_frame = pd.read_csv(file, names=["unix","date","symbol","open","high","low","close","Volume BTC","Volume USDT","tradecount"], nrows= xdays + 1)
    data_frame = pd.read_csv(file, names=["unix", "open", "high",
                     "low", "close", "volume", "close_time", "quote_av", "trades", "tb_base", "tb_quote_av","ignore"],index_col=False, skiprows=[0])
    data_frame.set_index("unix", inplace=True)
    data_frame = data_frame[["close"]]
    #data_frame.iloc[::-1]
    closelist = data_frame["close"]
    #closelist = closelist[1:]
    return data_frame

def normalize_data(scaler, close_list):
    """
    This section takes in our value lists and scales them using a minmaxscaler within the range 0,1 and reshapes our data.
    We then seperate our data into training and testing sets to a 80:20 split to be used to train and evaluate our model
    
    :param - scaler, close_list
    :returns - train, test
    """
    
    close_list = scaler.fit_transform(np.array(close_list).reshape(-1,1))
    
    train_split = int(len(close_list)*0.80)    
    train = close_list[0:train_split]
    test = close_list[train_split:len(close_list)]
    
    return train, test

def create_train_test_set(data):
    """
    This method takes in either our train or test set and creates a time lag of the predefined lookahead value
    It then returns the X and Y list where Y contains the time lagged data

    :param - data
    :returns - X_train, X_test, y_train, y_test
    """
    
    X = []
    Y = []
    
    future_look_ahead = 30
    previous_days= 30
    for i in range(previous_days, len(data) - future_look_ahead +1):
        X.append(data[i - previous_days:i, 0:data.shape[1]])
        Y.append(data[i + future_look_ahead - 1:i + future_look_ahead, 0])
        
    X, Y = np.array(X), np.array(Y)
    
    return X,Y

def create_lstm_model(X_train, y_train, learning_rate=0.001):
    """
    This method defines the general structure for the regressor that is passed into grid search
    
    :param - 
    :returns - model
    """
    model=Sequential()
    model.add(LSTM(30,return_sequences=True,input_shape=(X_train.shape[1], X_train.shape[2])))
    model.add(Dropout(0.1))
    model.add(LSTM(20,return_sequences=True))
    model.add(LSTM(10))
    model.add(Dense(y_train.shape[1]))
    model.compile(loss=MeanSquaredError(), optimizer=Adam(learning_rate=learning_rate), metrics=[tf.keras.metrics.RootMeanSquaredError()])
    
    return model

def run_grid_search(X_train, y_train):
    """
    This method performs grid search with given parameters on our generic regressor structure
    
    :param - X_train, y_train
    :returns - model
    """    
    grid_parameters = {
        'batch_size' : [2,8,32,64],
        'epochs' : [15,30,60,90],
        'learning_rate':[0.001,0.01,0.0001]
    }
    
    lsmt_model = KerasRegressor(build_fn=create_lstm_model)

    grid_results = GridSearchCV(lsmt_model, 
                            param_grid = grid_parameters,
                            scoring = 'neg_mean_squared_error',
                            cv = 2)
    
    grid_results.fit(X_train,y_train)
    return grid_results

def run_optimal_lstm_model(X_train, y_train, X_test, y_test):
    """
    This method builds and fits our LSTM model to our training data while evaluating score on the test data
    The method then returns our model once it has completed training
    
    :param - X_train, y_train, X_test, y_test, epochs, batchsize, optimizer
    :returns - model
    """
    


    model=Sequential()
    model.add(LSTM(30,return_sequences=True,input_shape=(X_train.shape[1], X_train.shape[2])))
    model.add(Dropout(0.1))
    model.add(LSTM(20,return_sequences=True))
    model.add(LSTM(10))
    model.add(Dense(y_train.shape[1]))
    model.compile(loss=MeanSquaredError(), optimizer=Adam(learning_rate=0.0001), metrics=[tf.keras.metrics.RootMeanSquaredError()])


    
    checkpoint_path = "C:/Users/niall/Desktop/Saved_model/cp.ckpt"
    checkpoint_dir = os.path.dirname(checkpoint_path)
    cp_callback = tf.keras.callbacks.ModelCheckpoint(checkpoint_path, save_weights_only=True,verbose=1)
    
    
    model.fit(
        X_train, X_train, validation_data=(X_test, y_test), verbose=2, callbacks = [cp_callback]
    )
    model.fit(
        X_train, y_train, epochs=100, validation_split=0.1, verbose=2
    )
    
    return model

def forecast_model(df, model, scaler,close_list, X_train, y_train, X_test):
    """
    In this method we forecast using our model and the test data set
    We then plot the inverse scaled values onto a graph with the real BTC price
    
    :param - X_train, y_train, X_test, y_test
    :returns - model
    """
    
    train_predict=model.predict(X_train)
    test_predict=model.predict(X_test)
    train_predict=scaler.inverse_transform(train_predict)
    test_predict=scaler.inverse_transform(test_predict)
    
    forecast_movement = np.concatenate((train_predict,test_predict))
    real_movement = df[["close"]][:186].values

    return real_movement

def predict(list_values,model,scaler): 
    df = pd.DataFrame (list_values, columns = ['close']) 
    close = df.reset_index()['close'] 
    close = scaler.fit_transform(np.array(close).reshape(-1, 1)) 
    close = numpy.array([close]) 
    prediction = model.predict(close) 
    prediction = scaler.inverse_transform(prediction) 
    return prediction