import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  accessToken: null,
  isAdmin: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAdmin = action.payload.isAdmin || false
    },
    logOut: (state) => {
      state.user = null
      state.accessToken = null
      state.isAdmin = false
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions
export default authSlice.reducer