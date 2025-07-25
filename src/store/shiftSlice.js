// import { createSlice } from '@reduxjs/toolkit';

// const shiftSlice = createSlice({
//   name: 'shift',
//   initialState: {
//     selectedShift: '',
//     selectedEmployee: null
//   },
//   reducers: {
//     setShift(state, action) {
//       state.selectedShift = action.payload;
//     },
//     setEmployee(state, action) {
//       state.selectedEmployee = action.payload;
//     }
//   }
// });

// export const { setShift, setEmployee } = shiftSlice.actions;
// export default shiftSlice.reducer;
// src/redux/shiftSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const persistedShift = localStorage.getItem('selectedShift');
const persistedEmployee = localStorage.getItem('selectedEmployee');
const persistedMode = localStorage.getItem('mode');
const persistedFurnace = localStorage.getItem('furnaceSize');

const shiftSlice = createSlice({
  name: 'shift',
  initialState: {
    selectedShift: persistedShift ? JSON.parse(persistedShift) : '',
    selectedEmployee: persistedEmployee ? JSON.parse(persistedEmployee) : null,
    mode: persistedMode || '',
    furnaceSize: persistedFurnace || ''
  },
  reducers: {
    setShift(state, action) {
      state.selectedShift = action.payload;
      localStorage.setItem('selectedShift', JSON.stringify(action.payload));
    },
    setEmployee(state, action) {
      state.selectedEmployee = action.payload;
      localStorage.setItem('selectedEmployee', JSON.stringify(action.payload));
    },
    setMode(state, action) {
      state.mode = action.payload;
      localStorage.setItem('mode', action.payload);
    },
    setFurnaceSize(state, action) {
      state.furnaceSize = action.payload;
      localStorage.setItem('furnaceSize', action.payload);
    },
    clearAll(state) {
      state.selectedShift = '';
      state.selectedEmployee = null;
      state.mode = '';
      state.furnaceSize = '';
      localStorage.removeItem('selectedShift');
      localStorage.removeItem('selectedEmployee');
      localStorage.removeItem('mode');
      localStorage.removeItem('furnaceSize');
    }
  }
});

export const {
  setShift,
  setEmployee,
  setMode,
  setFurnaceSize,
  clearAll
} = shiftSlice.actions;

export default shiftSlice.reducer;
