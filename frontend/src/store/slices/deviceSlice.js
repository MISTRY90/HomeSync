// src/store/slices/deviceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  devices: [],
  currentDevice: null,
  status: 'idle',
  error: null
};

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setDevices: (state, action) => {
      state.devices = action.payload;
    },
    addDevice: (state, action) => {
      state.devices.push(action.payload);
    },
    updateDeviceState: (state, action) => {
      const index = state.devices.findIndex(
        device => device.id === action.payload.id
      );
      if (index !== -1) {
        state.devices[index] = {
          ...state.devices[index],
          ...action.payload
        };
      }
    },
    removeDevice: (state, action) => {
      state.devices = state.devices.filter(
        device => device.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setDevices,
  addDevice,
  updateDeviceState,
  removeDevice,
  setLoading,
  setError
} = deviceSlice.actions;
export default deviceSlice.reducer;