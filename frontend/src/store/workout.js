import { createSlice } from '@reduxjs/toolkit';



const initialWorkoutState = {
  workoutId: '',
  title: '',
  description: '',
  visibility: '',
  cycles: '',
  image: ''
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState: initialWorkoutState,
  reducers: {
    getWorkout(state, action) {
      state.workoutId= action.payload;
    },
    getWorkoutStats(state, action) {
      state.title= action.payload[0];
      state.description= action.payload[1];
      state.visibility= action.payload[2];
      state.cycles= action.payload[3];
      state.image= action.payload[4];
    },
  },
});

export const workoutActions = workoutSlice.actions;

export default workoutSlice.reducer;