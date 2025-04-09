import { configureStore } from '@reduxjs/toolkit'
import { uiSlice } from '../features/uiSlice'
import { userSlice } from '../features/userSlice'



export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        user: userSlice.reducer
    }
})