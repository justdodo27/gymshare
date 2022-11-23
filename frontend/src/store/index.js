import { configureStore } from '@reduxjs/toolkit';


import authReducer from './auth';
import workoutReducer from './workout';
import monthReducer from './month';
import dayReducer from './day';
import sortReducer from './sort';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

const reducers = combineReducers({
  auth: authReducer, workout: workoutReducer, month: monthReducer, day: dayReducer, sort: sortReducer
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
},

);

export default store;