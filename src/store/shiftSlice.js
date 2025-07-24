import { createSlice } from '@reduxjs/toolkit';

const shiftSlice = createSlice({
  name: 'shift',
  initialState: {
    selectedShift: '',
    selectedEmployee: null
  },
  reducers: {
    setShift(state, action) {
      state.selectedShift = action.payload;
    },
    setEmployee(state, action) {
      state.selectedEmployee = action.payload;
    }
  }
});

export const { setShift, setEmployee } = shiftSlice.actions;
export default shiftSlice.reducer;
