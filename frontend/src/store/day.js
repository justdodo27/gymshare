import { createSlice } from '@reduxjs/toolkit';

const initialDayState = {
  day: '',
};

const daySlice = createSlice({
  name: 'day',
  initialState: initialDayState,
  reducers: {
    selected(state, action) {
      state.day = action.payload;
    },
  },
});

export const dayActions = daySlice.actions;

export default daySlice.reducer;