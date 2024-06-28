import { createSlice } from '@reduxjs/toolkit';

const storedUser =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('bongsUser')
    : null;

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, logOut } = userSlice.actions;

export default userSlice.reducer;
