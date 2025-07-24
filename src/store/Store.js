import { configureStore } from '@reduxjs/toolkit';
import shiftReducer from './shiftSlice';

export const store = configureStore({
  reducer: {
    shift: shiftReducer,
  },
});
