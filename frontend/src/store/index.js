import { configureStore } from '@reduxjs/toolkit';


import authReducer from './auth';
import workoutReducer from './workout';



const store = configureStore({
  reducer: {auth: authReducer, workout: workoutReducer},
});

export default store;