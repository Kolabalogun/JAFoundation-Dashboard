import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: localStorage.getItem("userId"),
  currentUserDisplayName: localStorage.getItem("userName"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.currentUser = action.payload;
    },
    userName: (state, action) => {
      state.currentUserDisplayName = action.payload;
    },
  },
});

export const { loginUser, userName } = authSlice.actions;

export default authSlice.reducer;
