// src/store/slices/analyticsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  energyUsage: {
    daily: [],
    weekly: [],
    monthly: []
  },
  deviceStatistics: {},
  loading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    fetchEnergyStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEnergySuccess: (state, action) => {
      state.energyUsage = action.payload;
      state.loading = false;
    },
    fetchEnergyFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateDeviceStats: (state, action) => {
      state.deviceStatistics = action.payload;
    }
  }
});

export const {
  fetchEnergyStart,
  fetchEnergySuccess,
  fetchEnergyFailure,
  updateDeviceStats
} = analyticsSlice.actions;
export default analyticsSlice.reducer;