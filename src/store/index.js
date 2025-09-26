import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import sidebarReducer from './slices/sidebarSlice'

const store = configureStore({
  reducer: {
    theme: themeReducer,
    sidebar: sidebarReducer,
  },
})

export default store 