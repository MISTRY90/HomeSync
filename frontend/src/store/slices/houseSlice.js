// src/store/slices/houseSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  houses: [],
  currentHouse: null,
  status: 'idle',
  error: null
};

const houseSlice = createSlice({
  name: 'houses',
  initialState,
  reducers: {
    setHouses: (state, action) => {
      state.houses = action.payload;
    },
    addHouse: (state, action) => {
      state.houses.push(action.payload);
    },
    updateHouse: (state, action) => {
      const index = state.houses.findIndex(
        house => house.id === action.payload.id
      );
      if (index !== -1) {
        state.houses[index] = action.payload;
      }
    },
    deleteHouse: (state, action) => {
      state.houses = state.houses.filter(
        house => house.id !== action.payload
      );
    }
  }
});

export const { setHouses, addHouse, updateHouse, deleteHouse } = houseSlice.actions;
export default houseSlice.reducer;