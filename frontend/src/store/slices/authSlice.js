import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Registration failed',
        details: error.response?.data?.errors || [error.response?.data?.message || 'Unknown error']
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Login failed',
        details: error.response?.data?.errors || [error.response?.data?.message || 'Invalid credentials']
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const setupMFA = createAsyncThunk(
  'auth/setupMFA',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.setupMFA();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyMFA = createAsyncThunk(
  'auth/verifyMFA',
  async (mfaData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyMFA(mfaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  mfaSetup: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    tokenRefresh: (state, action) => {
      state.accessToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Redirect to login or show success message
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.accessToken); // Simple persistence
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;  
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // MFA Setup
      .addCase(setupMFA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setupMFA.fulfilled, (state, action) => {
        state.loading = false;
        state.mfaSetup = action.payload;
      })
      .addCase(setupMFA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // MFA Verify
      .addCase(verifyMFA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMFA.fulfilled, (state) => {
        state.loading = false;
        state.mfaSetup = null;
      })
      .addCase(verifyMFA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default authSlice.reducer;
export const { clearError, tokenRefresh } = authSlice.actions;