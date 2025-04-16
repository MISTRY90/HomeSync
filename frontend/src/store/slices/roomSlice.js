import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roomService } from '../../services/roomService';

export const fetchRooms = createAsyncThunk(
  'rooms/fetchAll',
  async (houseId, { rejectWithValue }) => {
    try {
      const { data } = await roomService.getRooms(houseId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addRoom = createAsyncThunk(
  'rooms/add',
  async ({ houseId, roomData }, { rejectWithValue }) => {
    try {
      const { data } = await roomService.createRoom(houseId, roomData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    rooms: [],
    currentRoom: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = 'idle';
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
      .addCase(addRoom.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.status = 'idle';
        state.rooms.push(action.payload);
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      });
  },
});

export const { setCurrentRoom } = roomSlice.actions;
export default roomSlice.reducer;