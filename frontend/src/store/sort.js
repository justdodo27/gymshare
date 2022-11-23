import { createSlice } from '@reduxjs/toolkit';

const initialSortState = {
  term: '',
  arrow: false,
  sort: { value: 'id', label: 'Newest' }
};

const sortSlice = createSlice({
  name: 'sort',
  initialState: initialSortState,
  reducers: {
    getSortStats(state, action) {
      state.term= action.payload[0];
      state.arrow= action.payload[1];
      state.sort= action.payload[2];
    },
  },
});

export const sortActions = sortSlice.actions;

export default sortSlice.reducer;