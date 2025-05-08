import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { energyService } from '../../services/energyService';

export const fetchEnergyAnalytics = createAsyncThunk(
  'analytics/fetchEnergy',
  async (houseId, { rejectWithValue }) => {
    try {
      const { data } = await energyService.getEnergyAnalytics(houseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDeviceEnergy = createAsyncThunk(
  'analytics/fetchDeviceEnergy',
  async ({ houseId, deviceId, period }, { rejectWithValue }) => {
    try {
      const { data } = await energyService.getDeviceEnergy(houseId, deviceId, period);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchHouseEnergy = createAsyncThunk(
  'analytics/fetchHouseEnergy',
  async ({ houseId, period }, { rejectWithValue }) => {
    try {
      const { data } = await energyService.getHouseEnergy(houseId, period);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    energyUsage: {
      daily: [],
      weekly: [],
      monthly: [],
    },
    deviceStatistics: {},
    peakUsageTimes: [],
    summary: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnergyAnalytics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEnergyAnalytics.fulfilled, (state, action) => {
        state.status = 'idle';
        state.energyUsage = action.payload.usage;
        state.deviceStatistics = action.payload.summary;
        state.peakUsageTimes = action.payload.peakUsageTimes;
      })
      .addCase(fetchEnergyAnalytics.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(fetchDeviceEnergy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeviceEnergy.fulfilled, (state, action) => {
        state.status = 'idle';
        state.energyUsage.daily = action.payload;
      })
      .addCase(fetchDeviceEnergy.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(fetchHouseEnergy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHouseEnergy.fulfilled, (state, action) => {
        state.status = 'idle';
        state.energyUsage = action.payload;
      })
      .addCase(fetchHouseEnergy.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;