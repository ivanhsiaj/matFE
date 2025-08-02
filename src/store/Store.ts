// import { configureStore } from '@reduxjs/toolkit';
// import shiftReducer from './shiftSlice';
// import materialReducer from './materialSlice';

// export const store = configureStore({
//   reducer: {
//     shift: shiftReducer,
//     materials: materialReducer
//   },
// });


import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import shiftReducer from './shiftSlice';
import materialReducer from './materialSlice';
import dischargeReducer from './dischargeSlice';
// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the app dispatch type to include thunks
export type AppDispatch = typeof store.dispatch;

// Define the thunk action type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Configure the store
export const store = configureStore({
  reducer: {
    shift: shiftReducer,
    materials: materialReducer,
    discharges: dischargeReducer,
  },
});