import { createSlice } from "@reduxjs/toolkit";

const UserDataSlice = createSlice({
  name: "UserDatas", 
  initialState: {
    loading: false,
    UserData: [], 
    error: null,
  },
  reducers: {
    getUserDataSuccess(state, action) {
      state.loading = false;
      state.UserData = action.payload; 
    },

    getUserDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    UserDataUpdateSuccess(state, action) {
      state.loading = false;
      state.UserData = [...state.UserData, action.payload]; 
    },

    UserDataUpdateFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getUserDataSuccess,
  getUserDataFailure,
  UserDataUpdateSuccess,
  UserDataUpdateFailure,
} = UserDataSlice.actions;

export default UserDataSlice.reducer;
