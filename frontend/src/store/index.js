import { configureStore } from '@reduxjs/toolkit';


import authReducer from './auth';
import workoutReducer from './workout';
import monthReducer from './month';
import dayReducer from './day';



const store = configureStore({
  reducer: {auth: authReducer, workout: workoutReducer, month: monthReducer, day: dayReducer},
});

export default store;