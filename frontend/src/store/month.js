import { createSlice } from '@reduxjs/toolkit';

const initialMonthState = {
  month: '',
};

const monthSlice = createSlice({
  name: 'month',
  initialState: initialMonthState,
  reducers: {
    selected(state, action) {
      state.month = action.payload;
    },
  },
});

export const monthActions = monthSlice.actions;

export default monthSlice.reducer;