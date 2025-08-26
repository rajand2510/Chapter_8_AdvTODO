// store.js
import { configureStore } from "@reduxjs/toolkit";

import historyReducer from "./features/historySlice";
import todoReducer from "./features/todoSlice";
export const store = configureStore({
  reducer: {
    todo: todoReducer,
    tasks: historyReducer,
  },
});

export default store;
