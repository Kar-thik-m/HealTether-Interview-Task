import { configureStore } from "@reduxjs/toolkit";

import UserDatasRouter from "../Slice/UserDataSlice.js";

const store = configureStore({
  devTools: true,
  reducer: {
    UserDatas: UserDatasRouter,
  },
});

export default store;
