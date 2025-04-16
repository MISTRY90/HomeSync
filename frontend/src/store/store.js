// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { api, injectStore } from '../services/api';
import authReducer from './slices/authSlice';
import deviceReducer from './slices/deviceSlice';
import analyticsReducer from './slices/analyticsSlice';
import houseReducer from './slices/houseSlice';
import roomReducer from './slices/roomSlice';
import automationReducer from './slices/automationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: deviceReducer,
    analytics: analyticsReducer,
    houses: houseReducer,
    rooms: roomReducer,
    automations: automationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Inject the store into the API instance after creation
injectStore(store);