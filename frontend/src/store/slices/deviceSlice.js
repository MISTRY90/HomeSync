import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deviceService } from '../../services/deviceService';

export const fetchDevices = createAsyncThunk(
  'devices/fetchAll',
  async (houseId, { rejectWithValue }) => {
    try {
      const { data } = await deviceService.getDevices(houseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerDevice = createAsyncThunk(
  'devices/register',
  async ({ houseId, deviceData }, { rejectWithValue }) => {
    try {
      const { data } = await deviceService.registerDevice(houseId, deviceData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDeviceState = createAsyncThunk(
  'devices/updateState',
  async ({ houseId, deviceId, newState }, { rejectWithValue }) => {
    try {
      const { data } = await deviceService.updateState(houseId, deviceId, newState);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDevice = createAsyncThunk(
  'devices/delete',
  async ({ houseId, deviceId }, { rejectWithValue }) => {
    try {
      await deviceService.deleteDevice(houseId, deviceId);
      return deviceId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const deviceSlice = createSlice({
  name: 'devices',
  initialState: {
    devices: [],
    currentDevice: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // Sync reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.status = 'idle';
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(registerDevice.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerDevice.fulfilled, (state, action) => {
        state.status = 'idle';
        state.devices.push(action.payload);
      })
      .addCase(registerDevice.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(updateDeviceState.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDeviceState.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = state.devices.findIndex(device => device.id === action.payload.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
      })
      .addCase(updateDeviceState.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(deleteDevice.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.status = 'idle';
        state.devices = state.devices.filter(device => device.id !== action.payload);
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

export default deviceSlice.reducer;