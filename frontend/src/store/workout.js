import { createSlice } from '@reduxjs/toolkit';

const initialWorkoutState = {
  workoutId: '',
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState: initialWorkoutState,
  reducers: {
    getWorkout(state, action) {
      state.workoutId= action.payload;
    },
  },
});

export const workoutActions = workoutSlice.actions;

export default workoutSlice.reducer;