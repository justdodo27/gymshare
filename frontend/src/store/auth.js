import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  isAuthenticated: false,
  logout: false,
  token: '',
  userId: '',
  username: '',
  exp: '',
  is_staff: false,
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.logout = false;
      state.token = action.payload[0];
      state.userId = action.payload[1];
      state.username = action.payload[2]
      state.exp = action.payload[3]
      state.is_staff = action.payload[4]
    },
    logout(state) {
      state.isAuthenticated = false;
      state.logout = true;
      state.token = ''
      state.userId = ''
      state.username = ''
      state.exp = ''
      state.is_staff = false
    },
    autoLogout(state) {
      state.logout = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;