import { configureStore } from '@reduxjs/toolkit';


import authReducer from './auth';
import workoutReducer from './workout';
import monthReducer from './month';



const store = configureStore({
  reducer: {auth: authReducer, workout: workoutReducer, month: monthReducer},
});

export default store;