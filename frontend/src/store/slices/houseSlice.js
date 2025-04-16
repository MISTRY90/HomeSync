import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { houseService } from '../../services/houseService';

// Async Thunks
export const fetchHouses = createAsyncThunk(
  'houses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await houseService.getHouses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createHouse = createAsyncThunk(
  'houses/create',
  async (houseData, { rejectWithValue }) => {
    try {
      const response = await houseService.createHouse(houseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteHouse = createAsyncThunk(
  'houses/delete',
  async (houseId, { rejectWithValue }) => {
    try {
      await houseService.deleteHouse(houseId);
      return houseId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const inviteUserToHouse = createAsyncThunk(
  'houses/inviteUser',
  async ({ houseId, email, roleId }, { rejectWithValue }) => {
    try {
      const response = await houseService.inviteUser(houseId, email, roleId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'houses/updateUserRole',
  async ({ houseId, userId, roleId }, { rejectWithValue }) => {
    try {
      const response = await houseService.updateUserRole(houseId, userId, roleId);
      return { userId, roleId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  houses: [],
  currentHouse: null,
  loading: false,
  error: null,
  inviteStatus: 'idle',
};

const houseSlice = createSlice({
  name: 'houses',
  initialState,
  reducers: {
    setCurrentHouse: (state, action) => {
      state.currentHouse = action.payload;
    },
    clearHouseError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Houses
      .addCase(fetchHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHouses.fulfilled, (state, action) => {
        state.loading = false;
        state.houses = action.payload;
      })
      .addCase(fetchHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create House
      .addCase(createHouse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHouse.fulfilled, (state, action) => {
        state.loading = false;
        state.houses.push(action.payload);
        state.currentHouse = action.payload;
      })
      .addCase(createHouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete House
      .addCase(deleteHouse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHouse.fulfilled, (state, action) => {
        state.loading = false;
        state.houses = state.houses.filter(house => house.id !== action.payload);
        if (state.currentHouse?.id === action.payload) {
          state.currentHouse = null;
        }
      })
      .addCase(deleteHouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Invite User
      .addCase(inviteUserToHouse.pending, (state) => {
        state.inviteStatus = 'loading';
        state.error = null;
      })
      .addCase(inviteUserToHouse.fulfilled, (state) => {
        state.inviteStatus = 'succeeded';
      })
      .addCase(inviteUserToHouse.rejected, (state, action) => {
        state.inviteStatus = 'failed';
        state.error = action.payload;
      })
      
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const house = state.houses.find(h => h.id === action.payload.houseId);
        if (house) {
          const user = house.users.find(u => u.id === action.payload.userId);
          if (user) {
            user.roleId = action.payload.roleId;
          }
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentHouse, clearHouseError } = houseSlice.actions;
export default houseSlice.reducer;