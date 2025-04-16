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
      });
  },
});

export default deviceSlice.reducer;