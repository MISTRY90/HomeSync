import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { automationService } from '../../services/automationService';

export const fetchAutomations = createAsyncThunk(
  'automations/fetchAll',
  async (houseId, { rejectWithValue }) => {
    try {
      const { data } = await automationService.getAutomations(houseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createAutomation = createAsyncThunk(
  'automations/create',
  async ({ houseId, automationData }, { rejectWithValue }) => {
    try {
      const { data } = await automationService.createAutomation(houseId, automationData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const automationSlice = createSlice({
  name: 'automations',
  initialState: {
    automations: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAutomations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAutomations.fulfilled, (state, action) => {
        state.status = 'idle';
        state.automations = action.payload;
      })
      .addCase(fetchAutomations.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(createAutomation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAutomation.fulfilled, (state, action) => {
        state.status = 'idle';
        state.automations.push(action.payload);
      })
      .addCase(createAutomation.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

export default automationSlice.reducer;