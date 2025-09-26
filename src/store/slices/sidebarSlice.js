import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: false,
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload
    },
  },
})

export const { setSidebarShow } = sidebarSlice.actions

export default sidebarSlice.reducer 