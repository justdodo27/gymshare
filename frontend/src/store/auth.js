import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  isAuthenticated: false,
  token: '',
  userId: '',
  username: ''
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload[0];
      state.userId = action.payload[1];
      state.username = action.payload[2]
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = ''
      state.userId = ''
      state.username = ''
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;